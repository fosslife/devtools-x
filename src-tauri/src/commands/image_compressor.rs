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

    let img = image::open(path).map_err(|e| e.to_string())?;

    match format {
      ImageFormat::Jpeg => {
        let rgb_img = img.into_rgb8();
        let mut writer = Vec::new();
        let mut encoder = JpegEncoder::new_with_quality(&mut writer, quality);
        encoder
          .encode(
            rgb_img.as_raw(),
            rgb_img.width(),
            rgb_img.height(),
            ColorType::Rgb8
          )
          .map_err(|e| e.to_string())?;
        println!("Time: {:?}", time.elapsed());
        Ok(writer)
      }
      ImageFormat::Png => {
        let rgb_img = img.into_rgb8();
        let mut writer = Vec::new();
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
          .write_image(
            rgb_img.as_raw(),
            rgb_img.width(),
            rgb_img.height(),
            ColorType::Rgb8
          )
          .map_err(|e| e.to_string())?;
        println!("Time: {:?}", time.elapsed());
        Ok(writer)
      }
      ImageFormat::Webp => {
        // For WebP, we use the original image since webp::Encoder handles the conversion
        let x = webp::Encoder::from_image(&img)
          .map_err(|e| e.to_string())?
          .encode(quality as f32);
        println!("Time: {:?}", time.elapsed());
        Ok(x.to_vec())
      }
    }
  }
}
