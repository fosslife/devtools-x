pub mod minify {
  use minify_html::{minify, Cfg};

  #[tauri::command]
  pub async fn minifyhtml(input: String) -> Result<String, String> {
    let cfg = Cfg::new();
    let minified = minify(input.as_bytes(), &cfg);
    String::from_utf8(minified).map_err(|e| e.to_string())
  }
}
