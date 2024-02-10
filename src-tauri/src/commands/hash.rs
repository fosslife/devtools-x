pub mod hash {
  use std::{fs, io};

  use dashmap::DashMap;
  use md5::{Digest, Md5};
  use rayon::prelude::*;

  #[tauri::command]
  pub fn hash(filenames: Vec<String>) -> DashMap<String, String> {
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
}
