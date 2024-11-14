#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::convert::TryInto;
use std::env;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

use tauri_plugin_sql::{Migration, MigrationKind};

mod commands;

use commands::base64_image::base64_image::base64_image;
use commands::compress::compress::compress;
use commands::hash::hash::hash;
use commands::image::images::compress_images;
use commands::image_compressor::images::compress_images_to_buffer;
use commands::minify::minify::minifyhtml;
use commands::ping::ping::ping;
use commands::qr::qr::read_qr;

fn main() {
  // Todo move to different file
  let migrations = vec![
    Migration {
      version: 1,
      description: "create_initial_tables",
      sql: "
        CREATE TABLE IF NOT EXISTS snippets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS snippets_tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            snippet_id INTEGER NOT NULL,
            tag TEXT NOT NULL,
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)
        );
        CREATE TABLE IF NOT EXISTS snippets_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            snippet_id INTEGER NOT NULL,
            note TEXT NOT NULL,
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)
        );
        CREATE TABLE IF NOT EXISTS snippets_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            snippet_id INTEGER NOT NULL,
            name TEXT,
            file_path TEXT,
            filetype TEXT,
            content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)
        );",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 2,
      description: "new_structure",
      sql: "
       -- First create a temporary table with the new structure
        CREATE TABLE snippets_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT NOT NULL,
            language TEXT NOT NULL,
            tags TEXT,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Delete the sqlite_sequence entry for snippets_new to reset AUTOINCREMENT
        DELETE FROM sqlite_sequence WHERE name = 'snippets_new';

        -- Copy and transform data from old tables to new structure
        INSERT INTO snippets_new (id, title, code, language, tags, note, created_at)
        SELECT 
            s.id,
            s.name as title,
            COALESCE(sf.content, '') as code,
            COALESCE(sf.filetype, 'text') as language,
            (SELECT GROUP_CONCAT(tag, ',') FROM snippets_tags WHERE snippet_id = s.id) as tags,
            (SELECT GROUP_CONCAT(note, '\n') FROM snippets_notes WHERE snippet_id = s.id) as note,
            s.created_at
        FROM snippets s
        LEFT JOIN snippets_files sf ON s.id = sf.snippet_id
        GROUP BY s.id;

        -- Drop old tables
        DROP TABLE snippets_files;
        DROP TABLE snippets_notes;
        DROP TABLE snippets_tags;
        DROP TABLE snippets;

        -- Rename new table to snippets
        ALTER TABLE snippets_new RENAME TO snippets;

        -- Update the sqlite_sequence to continue from the last used id
        UPDATE sqlite_sequence 
        SET seq = (SELECT MAX(id) FROM snippets) 
        WHERE name = 'snippets';
    ",
      kind: MigrationKind::Up,
    },
    Migration {
      version: 3,
      description: "add_fts_search",
      sql: "
                 -- Create FTS virtual table with multiple columns
        CREATE VIRTUAL TABLE IF NOT EXISTS snippets_fts USING fts5(
            title, 
            code,
            note,
            tags,
            content='snippets',
            content_rowid='id'
        );

        -- Populate FTS table with existing data
        INSERT INTO snippets_fts(rowid, title, code, note, tags)
            SELECT id, title, code, note, tags FROM snippets;

        -- Create triggers to keep FTS index up to date
        CREATE TRIGGER snippets_ai AFTER INSERT ON snippets BEGIN
            INSERT INTO snippets_fts(rowid, title, code, note, tags) 
            VALUES (new.id, new.title, new.code, new.note, new.tags);
        END;

        CREATE TRIGGER snippets_ad AFTER DELETE ON snippets BEGIN
            INSERT INTO snippets_fts(snippets_fts, rowid, title, code, note, tags) 
            VALUES('delete', old.id, old.title, old.code, old.note, old.tags);
        END;

        CREATE TRIGGER snippets_au AFTER UPDATE ON snippets BEGIN
            INSERT INTO snippets_fts(snippets_fts, rowid, title, code, note, tags) 
            VALUES('delete', old.id, old.title, old.code, old.note, old.tags);
            INSERT INTO snippets_fts(rowid, title, code, note, tags) 
            VALUES (new.id, new.title, new.code, new.note, new.tags);
        END;
      ",
      kind: MigrationKind::Up,
    },
  ];

  tauri::Builder::default()
    .plugin(
      tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:devtools.db", migrations)
        .build(),
    )
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_clipboard_manager::init())
    // .plugin(tauri_plugin_aptabase::Builder::new("A-EU-0242299228").build())
    .invoke_handler(tauri::generate_handler![
      hash,
      ping,
      minifyhtml,
      compress_images,
      base64_image,
      compress,
      compress_images_to_buffer,
      read_qr
    ])
    .setup(|app| {
      #[cfg(desktop)]
      let res = app
        .handle()
        .plugin(tauri_plugin_updater::Builder::new().build());
      if res.is_err() {
        println!("Error: {:?}", res.err());
      }

      WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title("DevTools-X")
        .inner_size(1000.0, 850.0)
        .resizable(true)
        .fullscreen(false)
        .build()?;
      // #[cfg(debug_assertions)]
      let process_arg: Vec<String> = env::args().collect();
      if process_arg.contains(&"--debug".to_string()) {
        // in prod build, if --debug is passed, open devtools
        app.get_webview_window("main").unwrap().open_devtools();
      }
      #[cfg(debug_assertions)]
      app.get_webview_window("main").unwrap().open_devtools();
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
