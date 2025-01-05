pub mod qr {
  use std::str::from_utf8;

  use image;

  #[tauri::command]
  pub fn read_qr(path: String) -> Result<String, String> {
    let image = match image::open(&path) {
      Ok(img) => img,
      Err(e) => return Err(format!("Failed to open image: {}", e)),
    };

    let img_gray = image.to_luma8();

    let mut decoder = quircs::Quirc::default();

    let codes = decoder.identify(
      img_gray.width() as usize,
      img_gray.height() as usize,
      &img_gray,
    );

    let mut ret = String::new();
    let mut has_error = false;

    for code in codes {
      match code {
        Ok(code) => match code.decode() {
          Ok(decoded) => match from_utf8(&decoded.payload) {
            Ok(text) => ret.push_str(text),
            Err(_) => has_error = true,
          },
          Err(_) => has_error = true,
        },
        Err(_) => has_error = true,
      }
    }

    if ret.is_empty() {
      if has_error {
        Err("Invalid QR code or image format".to_string())
      } else {
        Err("No QR code found in image".to_string())
      }
    } else {
      Ok(ret)
    }
  }
}
