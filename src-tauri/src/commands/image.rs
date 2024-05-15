pub mod images {
  use anyhow::Result;
  use image::{codecs::jpeg::JpegEncoder, ImageEncoder};
  use oxipng::{optimize, InFile, Options, OutFile};
  use rayon::prelude::*;
  use serde::Deserialize;
  use std::{
    fs::File,
    io::{BufWriter, Write},
    ops::Deref,
    path::Path,
  };
  use tokio::time::Instant;
  use webp::Encoder as WebPEncoder;

  pub fn compress(img_path: &String, destination: &String, quality: u8) -> Result<()> {
    let path = Path::new(img_path);
    let destination_path = Path::new(destination);
    let img: image::DynamicImage = image::open(path).unwrap();
    let width = img.width();
    let height = img.height();
    let color = img.color();

    let format = match path.extension().unwrap().to_str().unwrap() {
      "jpg" | "jpeg" => ImageFormat::Jpeg,
      "png" => ImageFormat::Png,
      "webp" => ImageFormat::Webp,
      _ => ImageFormat::Jpeg,
    };

    let output_extention = match format {
      ImageFormat::Jpeg => "jpg",
      ImageFormat::Png => "png",
      ImageFormat::Webp => "webp",
    };

    let output_path = path.with_extension(format!("compression.{}", output_extention));
    //  output path is dir, join with file name
    let output_path = destination_path.join(output_path.file_name().unwrap());
    let output_file = File::create(output_path.clone()).unwrap();
    let writer = BufWriter::new(output_file);

    match format {
      ImageFormat::Jpeg => {
        let mut encoder = JpegEncoder::new_with_quality(writer, quality);
        encoder
          .encode(&img.into_bytes(), width, height, color)
          .unwrap();
      }
      ImageFormat::Png => {
        let input = InFile::Path(path.to_path_buf());
        let output = OutFile::Path {
          path: Some(output_path.clone()),
          preserve_attrs: true,
        };
        let options = Options {
          force: true,
          ..Default::default()
        };
        optimize(&input, &output, &options).unwrap();
      }
      ImageFormat::Webp => {
        let encoder = WebPEncoder::from_image(&img).unwrap();
        let webpmem = encoder.encode(quality as f32);
        let mut webpfile = File::create(output_path.clone()).unwrap();
        webpfile.write_all(&webpmem.deref()).unwrap();
      }
    }

    Ok(())
  }

  #[derive(Debug, Clone, Copy, Deserialize)]
  pub enum ImageFormat {
    Jpeg,
    Png,
    Webp,
  }

  #[tauri::command]
  pub async fn compress_images(
    images: Vec<String>,
    destination: String,
    quality: u8,
    window: tauri::Window,
  ) -> Result<String, String> {
    let parent_start = Instant::now();
    images.par_iter().for_each(|image| {
      let start = Instant::now();
      let done: std::prelude::v1::Result<(), anyhow::Error> =
        compress(image, &destination, quality);
      match done {
        Ok(_) => {
          window.emit("image_compressor_progress", image).unwrap();
        }
        Err(e) => println!("{} failed to compress: {:?}", image, e),
      }
      let end = start.elapsed();
      println!("{} compressed in: {:?} ms", image, end.as_millis());
    });
    let parent_end = parent_start.elapsed();
    println!(
      "all images compression took: {:?} ms",
      parent_end.as_millis(),
    );
    Ok(format!(
      "all images compressed in: {:?} ms",
      parent_end.as_millis()
    ))
  }
}
