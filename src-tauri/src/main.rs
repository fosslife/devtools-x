#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use dashmap::DashMap;
use md5::{Digest, Md5};
use rayon::prelude::*;
use std::{env, fs, io};
use tauri::{Manager, WindowBuilder, WindowUrl};

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![hash])
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

#[tauri::command]
fn hash(filenames: Vec<String>) -> DashMap<String, String> {
  let map = DashMap::new();
  filenames.into_par_iter().for_each(|file| {
    let mut hasher = Md5::new();

    let mut f = fs::File::open(&file).unwrap();
    io::copy(&mut f, &mut hasher).unwrap();

    let hash = hasher.finalize();
    let hex_hash = base16ct::lower::encode_string(&hash);

    map.insert(file, hex_hash);
  });
  map
}
