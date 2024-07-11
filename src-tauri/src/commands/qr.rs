pub mod qr {

  #[tauri::command]
  pub fn read_qr(path: String) -> String {
    let image = image::open(path).unwrap();
    let decoder = bardecoder::default_decoder();
    let result = decoder.decode(&image);
    let mut ret = String::new();

    for code in result {
      match code {
        Ok(code) => {
          println!("Decoded QR code: {:?}", code);
          ret.push_str(&code)
        }
        Err(e) => {
          println!("Error decoding QR code: {:?}", e);
          return "".to_string();
        }
      }
    }

    ret
  }
}
