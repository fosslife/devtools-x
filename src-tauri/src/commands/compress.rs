pub mod compress {
  use base64::engine::general_purpose;
  use base64::Engine;
  use flate2::write::{DeflateEncoder, GzEncoder, ZlibEncoder};
  use flate2::Compression;
  use std::io::prelude::*;

  #[tauri::command]
  pub fn compress(input: String, compression_level: u32, algorithm: String) -> String {
    let compression = match compression_level {
      0..=9 => Compression::new(compression_level),
      _ => panic!("invalid compression level: {}", compression_level),
    };

    let compressed_bytes = match algorithm.as_str() {
      "deflate" => {
        let mut encoder = DeflateEncoder::new(Vec::new(), compression);
        encoder.write_all(input.as_bytes()).unwrap();
        encoder.finish().unwrap()
      }
      "gzip" => {
        let mut encoder = GzEncoder::new(Vec::new(), compression);
        encoder.write_all(input.as_bytes()).unwrap();
        encoder.finish().unwrap()
      }
      "zlib" => {
        let mut encoder = ZlibEncoder::new(Vec::new(), compression);
        encoder.write_all(input.as_bytes()).unwrap();
        encoder.finish().unwrap()
      }
      _ => panic!("invalid algorithm: {}", algorithm),
    };
    let base64 = general_purpose::STANDARD.encode(&compressed_bytes);
    base64
  }
}
