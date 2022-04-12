import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { dialog, fs } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { useRef, useState } from "react";
import { ReactCompareSlider } from "react-compare-slider";

function Image() {
  let rightRef = useRef<HTMLImageElement>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob>();

  const [imageSrc, setImageSrc] = useState({
    left: "",
    right: "",
  });

  const resize = async () => {
    let { vips } = self;
    if (!rightRef.current) return; // typescript check

    let arr = await fs.readBinaryFile(imageSrc.right);
    // .catch(console.error);

    let im = vips.Image.newFromBuffer(arr);
    console.time("compress");
    let outBuffer = im.jpegsaveBuffer({
      Q: 20,
      strip: true,
    });
    console.timeEnd("compress");

    const blob = new Blob([outBuffer], { type: "image/jpeg" });
    const blobURL = URL.createObjectURL(blob);
    rightRef.current.src = blobURL;
    setDownloadBlob(blob);
  };

  return (
    <Flex h="100%" w="100%" boxSizing="border-box">
      <Box w="500px">
        {imageSrc.left ? (
          <ReactCompareSlider
            onlyHandleDraggable={true}
            itemOne={
              <img
                src={convertFileSrc(imageSrc.left)}
                alt="Left"
                height="400px"
              />
            }
            itemTwo={
              <img
                src={convertFileSrc(imageSrc.right)}
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
              setImageSrc({
                left: path as string,
                right: path as string,
              });
            });
        }}
      >
        Select Image
      </Button>
      <Button onClick={resize}>Resize</Button>

      <Button
        onClick={async () => {
          let downloadPath = await save({
            filters: [{ name: "images", extensions: ["jpg", "png", "jpeg"] }],
            title: "Select location",
          });

          let ab = await downloadBlob?.arrayBuffer();

          fs.writeBinaryFile({
            contents: new Uint8Array(ab as ArrayBuffer),
            path: downloadPath,
          });
        }}
      >
        Save api
      </Button>
    </Flex>
  );
}

export default Image;
