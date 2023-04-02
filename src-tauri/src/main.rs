#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use tauri::{Manager, WindowBuilder, WindowUrl};

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .setup(|app| {
      WindowBuilder::new(app, "main", WindowUrl::App("index.html".into()))
        .title("DevTools-X")
        .inner_size(1000.0, 650.0)
        .resizable(true)
        .fullscreen(false)
        .build()?;
      // #[cfg(debug_assertions)]
      let process_arg: Vec<String> = env::args().collect();
      if process_arg.contains(&"--debug".to_string()) {
        // in prod build, if --debug is passed, open devtools
        app.get_window("main").unwrap().open_devtools();
      }
      #[cfg(debug_assertions)]
      app.get_window("main").unwrap().open_devtools();
      // println!("Proces args {:?}", processArg);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

//THIS CSP IS SO CLOSE TO WORK. ; worker-src 'self' blob: https://tauri.localhost/; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'
