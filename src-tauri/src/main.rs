#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::convert::TryInto;
use std::env;
use tauri::{Manager, WindowBuilder, WindowUrl};

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
        sql: "\
        CREATE TABLE snippets (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            name TEXT NOT NULL,\
            path TEXT NOT NULL,\
            content TEXT,\
            filetype TEXT,\
            parent_id INTEGER,\
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\
        );\
        CREATE TABLE snippets_tags (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            snippet_id INTEGER NOT NULL,\
            tag TEXT NOT NULL,\
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)\
        );\
        CREATE TABLE snippets_notes (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            snippet_id INTEGER NOT NULL,\
            note TEXT NOT NULL,\
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)\
        );\
        CREATE TABLE snippets_files (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            snippet_id INTEGER NOT NULL,\
            file_path TEXT NOT NULL,\
            FOREIGN KEY(snippet_id) REFERENCES snippets (id)\
        );",
        kind: MigrationKind::Up,
    }
  ];

  tauri::Builder::default()
    .plugin(
        tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:devtools.db", migrations)
            .build()
    )
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_aptabase::Builder::new("A-EU-0242299228").build())
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
      WindowBuilder::new(app, "main", WindowUrl::App("index.html".into()))
        .title("DevTools-X")
        .inner_size(1000.0, 650.0)
        .resizable(true)
        .fullscreen(false)
        .on_web_resource_request(|_, res| {
          res.headers_mut().insert(
            "Cross-Origin-Embedder-Policy",
            "require-corp".try_into().unwrap(),
          );
          res.headers_mut().append(
            "Cross-Origin-Opener-Policy",
            "same-origin".try_into().unwrap(),
          );
        })
        .build()?;
      // #[cfg(debug_assertions)]
      let process_arg: Vec<String> = env::args().collect();
      if process_arg.contains(&"--debug".to_string()) {
        // in prod build, if --debug is passed, open devtools
        app.get_window("main").unwrap().open_devtools();
      }
      #[cfg(debug_assertions)]
      app.get_window("main").unwrap().open_devtools();
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
