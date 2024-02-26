#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::convert::TryInto;
use std::env;
use tauri::{Manager, WindowBuilder, WindowUrl};

mod commands;

use commands::base64_image::base64_image::base64_image;
use commands::hash::hash::hash;
use commands::image::images::compress_images;
use commands::minify::minify::minifyhtml;
use commands::ping::ping::ping;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![
      hash,
      ping,
      minifyhtml,
      compress_images,
      base64_image
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
