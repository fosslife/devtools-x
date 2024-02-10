pub mod ping {
  use std::time::Duration;
  use surge_ping::{Client, Config, IcmpPacket, PingIdentifier, PingSequence, ICMP};
  use tauri::Runtime;
  use tokio::time;

  #[derive(Default, Debug)]
  struct Answer {
    host: String,
    transmitted: usize,
    received: usize,
    durations: Vec<Duration>,
  }
  impl Answer {
    fn new(host: &str) -> Answer {
      Answer {
        host: host.to_owned(),
        transmitted: 0,
        received: 0,
        durations: Vec::new(),
      }
    }

    fn update(&mut self, dur: Option<Duration>) {
      match dur {
        Some(dur) => {
          self.transmitted += 1;
          self.received += 1;
          self.durations.push(dur);
        }
        None => self.transmitted += 1,
      }
    }

    fn min(&self) -> Option<f64> {
      let min = self
        .durations
        .iter()
        .min()
        .map(|dur| dur.as_secs_f64() * 1000f64);
      min
    }

    fn max(&self) -> Option<f64> {
      let max = self
        .durations
        .iter()
        .max()
        .map(|dur| dur.as_secs_f64() * 1000f64);
      max
    }

    fn avg(&self) -> Option<f64> {
      let sum: Duration = self.durations.iter().sum();
      let avg = sum
        .checked_div(self.durations.iter().len() as u32)
        .map(|dur| dur.as_secs_f64() * 1000f64);
      avg
    }

    fn mdev(&self) -> Option<f64> {
      if let Some(avg) = self.avg() {
        let tmp_sum = self.durations.iter().fold(0_f64, |acc, x| {
          acc + x.as_secs_f64() * x.as_secs_f64() * 1000000f64
        });
        let tmdev = tmp_sum / self.durations.iter().len() as f64 - avg * avg;
        Some(tmdev.sqrt())
      } else {
        None
      }
    }

    fn output(&self) -> String {
      let mut result = String::new();

      result.push_str(&format!("\n--- {} ping statistics ---\n", self.host));

      result.push_str(&format!(
        "{} packets transmitted, {} packets received, {:.2}% packet loss\n
",
        self.transmitted,
        self.received,
        (self.transmitted - self.received) as f64 / self.transmitted as f64 * 100_f64
      ));

      if self.received > 1 {
        result.push_str(&format!("round-trip min = {:.3} ms\n", self.min().unwrap(),));
        result.push_str(&format!("round-trip avg = {:.3} ms\n", self.avg().unwrap(),));
        result.push_str(&format!("round-trip max = {:.3} ms\n", self.max().unwrap(),));
        result.push_str(&format!(
          "round-trip mdev = {:.3} ms\n",
          self.mdev().unwrap(),
        ));
      }

      result
    }
  }

  #[tauri::command]
  pub async fn ping<R: Runtime>(
    url: String,
    timeout: u64,
    count: u16,
    window: tauri::Window<R>,
  ) -> Result<(), String> {
    let ip = tokio::net::lookup_host(format!("{}:0", url))
      .await
      .expect("host lookup error")
      .next()
      .map(|val| val.ip())
      .unwrap();

    let mut interval = time::interval(Duration::from_millis((1.0 * 1000f64) as u64));

    let mut config_builder = Config::builder();

    if ip.is_ipv6() {
      config_builder = config_builder.kind(ICMP::V6);
    }
    let config = config_builder.build();

    let client = Client::new(&config).unwrap();
    let mut pinger = client.pinger(ip, PingIdentifier(111)).await;

    pinger.timeout(Duration::from_secs(timeout));

    let payload = vec![0; 56];
    let mut answer = Answer::new(&url);

    for idx in 0..count {
      interval.tick().await;
      match pinger.ping(PingSequence(idx), &payload).await {
        Ok((IcmpPacket::V4(reply), dur)) => {
          window
            .emit(
              "ping-response",
              format!(
                "{} bytes from {}: icmp_seq={} ttl={:?} time={:0.3?}",
                reply.get_size(),
                reply.get_source(),
                reply.get_sequence(),
                reply.get_ttl(),
                dur
              ),
            )
            .unwrap();
          answer.update(Some(dur));
        }
        Ok((IcmpPacket::V6(reply), dur)) => {
          window
            .emit(
              "ping-response",
              format!(
                "{} bytes from {}: icmp_seq={} ttl={:?} time={:0.3?}",
                reply.get_size(),
                reply.get_source(),
                reply.get_sequence(),
                reply.get_max_hop_limit(),
                dur
              ),
            )
            .unwrap();
          answer.update(Some(dur));
        }
        Err(_) => {
          answer.update(None);
        }
      }
    }
    let summary = answer.output();

    window.emit("ping-response", summary).unwrap();

    Ok(())
  }
}
