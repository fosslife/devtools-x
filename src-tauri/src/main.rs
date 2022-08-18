#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use std::convert::TryInto;
use std::env;
use tauri::{
  http::header::HeaderValue,
  utils::config::{Csp, CspDirectiveSources},
  Manager, WindowBuilder, WindowUrl,
};

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      WindowBuilder::new(app, "main", WindowUrl::App("index.html".into()))
        .title("DevTools-X")
        .inner_size(1000.0, 650.0)
        .resizable(true)
        .fullscreen(false)
        .on_web_resource_request(|request, response| {
          // println!("Request {:?}\n\n", req.headers());
          // println!("Response {:?}\n\n", res.headers());

          // FIXME:
          if request.uri().starts_with("tauri://") {
            // if we have a CSP header, Tauri is loading an HTML file
            //  for this example, let's dynamically change the CSP
            if let Some(csp) = response.headers_mut().get_mut("Content-Security-Policy") {
              // use the tauri helper to parse the CSP policy to a map
              let mut csp_map: HashMap<String, CspDirectiveSources> =
                Csp::Policy(csp.to_str().unwrap().to_string()).into();
              csp_map
                .entry("script-src".to_string())
                .or_insert_with(Default::default)
                .push("https:  'unsafe-eval' 'unsafe-inline'");

              csp_map.insert(
                "worker-src".to_string(),
                CspDirectiveSources::Inline("'self' blob: https://tauri.localhost/".to_string()), // "'self' blob: https://tauri.localhost/",
              );

              // use the tauri helper to get a CSP string from the map
              let csp_string = Csp::from(csp_map).to_string();

              *csp = HeaderValue::from_str(&csp_string).unwrap();
            }
          }

          response.headers_mut().insert(
            "Cross-Origin-Embedder-Policy",
            "require-corp".try_into().unwrap(),
          );
          response.headers_mut().append(
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
      // println!("Proces args {:?}", processArg);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

//THIS CSP IS SO CLOSE TO WORK. ; worker-src 'self' blob: https://tauri.localhost/; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'
