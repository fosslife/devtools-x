pub mod base64_image {
  use base64::{engine::general_purpose, prelude::*};

  #[tauri::command]
  pub async fn base64_image(file_path: String) -> String {
    let image = tokio::fs::read(file_path).await.unwrap();
    let base64 = general_purpose::STANDARD.encode(&image);
    base64
  }
}
