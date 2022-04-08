import { Box, Button, Flex } from "@chakra-ui/react";
import { dialog, fs } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { useEffect, useRef, useState } from "react";
import { ReactCompareSlider } from "react-compare-slider";

function Image() {
  let rightRef = useRef<HTMLImageElement>(null);

  const [imageSrc, setImageSrc] = useState({
    left: "",
    right: "",
  });

  useEffect(() => {
    (async () => {
      if (!imageSrc.right) return;
      let { vips } = self;
      // #C83658 as CIELAB triple
      const start = [46.479, 58.976, 15.052];

      // #D8E74F as CIELAB triple
      const stop = [88.12, -23.952, 69.178];

      // Makes a lut which is a smooth gradient from start colour to stop colour,
      // with start and stop in CIELAB
      // let lut = vips.Image.identity() / 255;
      let lut = vips.Image.identity().divide(255);

      // lut = lut * stop + (1 - lut) * start;
      lut = lut.multiply(stop).add(lut.multiply(-1).add(1).multiply(start));

      lut = lut.colourspace(vips.Interpretation.srgb /* 'srgb' */, {
        source_space: vips.Interpretation.lab, // 'lab'
      });

      let arr = await fs.readBinaryFile(
        "C:\\Users\\Spark\\Desktop\\vlad-dyshlivenko-2IdjqOIFIWM-unsplash.jpg"
      );
      // .catch(console.error);

      let im = vips.Image.newFromBuffer(arr);
      if (im.hasAlpha()) {
        // Separate alpha channel
        const withoutAlpha = im.extractBand(0, { n: im.bands - 1 });
        const alpha = im.extractBand(im.bands - 1);
        im = withoutAlpha
          .colourspace(vips.Interpretation.b_w /* 'b-w' */)
          .maplut(lut)
          .bandjoin(alpha);
      } else {
        im = im.colourspace(vips.Interpretation.b_w /* 'b-w' */).maplut(lut);
      }
      console.time("op");
      const outBuffer = im.writeToBuffer(".jpg");
      console.timeEnd("op");

      const blob = new Blob([outBuffer], { type: "image/jpeg" });
      const blobURL = URL.createObjectURL(blob);
      rightRef.current.src = blobURL;
    })();
  }, [imageSrc.right]);

  return (
    <Flex h="100%" w="100%" boxSizing="border-box">
      <Box w="500px">
        {imageSrc.left ? (
          <ReactCompareSlider
            itemOne={<img src={imageSrc.left} alt="Left" height="400px" />}
            itemTwo={
              <img
                src={imageSrc.right}
                alt="right"
                ref={rightRef}
                height="400px"
              />
            }
          />
        ) : null}
      </Box>

      <Button
        onClick={() => {
          dialog
            .open({
              multiple: false,
              title: "Select an Image",
              directory: false,
            })
            .then(async (path) => {
              let fp = convertFileSrc(path as string);
              setImageSrc({
                left: fp,
                right: fp,
              });
              //   let image = await fs.readBinaryFile(fp);
            });
        }}
      >
        Select Image
      </Button>
      <Button
        onClick={async () => {
          let file = await fs.readBinaryFile(imageSrc.right);
        }}
      >
        Resize
      </Button>
    </Flex>
  );
}

export default Image;
