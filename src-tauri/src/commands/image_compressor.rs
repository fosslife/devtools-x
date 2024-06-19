pub mod images {
  use std::path::Path;

  use image::{
    codecs::{
      jpeg::JpegEncoder,
      png::{CompressionType, PngEncoder},
    },
    ColorType, ImageEncoder,
  };
  use serde::{Deserialize, Serialize};

  #[derive(Debug, Deserialize, Serialize)]
  pub enum ImageFormat {
    Jpeg,
    Png,
    Webp,
  }

  #[tauri::command]
  pub async fn compress_images_to_buffer(
    image_path: String,
    quality: u8,
    format: ImageFormat,
  ) -> Result<Vec<u8>, String> {
    let time = std::time::Instant::now();
    let path = Path::new(&image_path);

    let img = image::open(path).map_err(|e| e.to_string()).unwrap();

    match format {
      ImageFormat::Jpeg => {
        let mut writer = Vec::new();
        let mut encoder = JpegEncoder::new_with_quality(&mut writer, quality);
        encoder
          .encode(img.as_bytes(), img.width(), img.height(), ColorType::Rgb8)
          .map_err(|e| e.to_string())
          .unwrap();
        println!("Time: {:?}", time.elapsed());
        return Ok(writer);
      }
      ImageFormat::Png => {
        let mut writer = Vec::new();
        // convert quality percentage to CompressionType
        let compression_level = match quality {
          0..=33 => CompressionType::Best,
          34..=66 => CompressionType::Default,
          67..=100 => CompressionType::Fast,
          _ => CompressionType::Default,
        };
        let encoder = PngEncoder::new_with_quality(
          &mut writer,
          compression_level,
          image::codecs::png::FilterType::Sub,
        );
        encoder
          .write_image(img.as_bytes(), img.width(), img.height(), ColorType::Rgb8)
          .map_err(|e| e.to_string())
          .unwrap();
        println!("Time: {:?}", time.elapsed());
        return Ok(writer);
      }
      ImageFormat::Webp => {
        let x = webp::Encoder::from_image(&img)
          .unwrap()
          .encode(quality as f32);
        // .map_err(|e| e.to_string())
        // .unwrap();
        println!("Time: {:?}", time.elapsed());
        return Ok(x.to_vec());
      }
    }
  }
}
