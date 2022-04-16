import {
  Box,
  Button,
  Divider,
  Flex,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { dialog, fs } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { motion } from "framer-motion";

import { useRef, useState } from "react";
import { ReactCompareSlider, styleFitContainer } from "react-compare-slider";

function Image() {
  let rightRef = useRef<HTMLImageElement>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob>();
  const [quality, setQuality] = useState(50);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageType, setImageType] = useState<"webp" | "jpeg" | "png">("webp");
  const parentRef = useRef<any>(); // HTMLDivElement type not working with chakra flexbox

  const [sizes, setSizes] = useState({
    og: "0",
    conv: "0",
  });

  const [imageSrc, setImageSrc] = useState({
    left: "",
    right: "",
  });

  const download = async () => {
    let downloadPath = await save({
      defaultPath: "compressed",
      filters: [{ name: "images", extensions: [imageType] }],
      title: "Select location",
    });

    let ab = await downloadBlob?.arrayBuffer();

    fs.writeBinaryFile({
      contents: new Uint8Array(ab as ArrayBuffer),
      path: downloadPath,
    });
  };

  const resize = async () => {
    let { vips } = self;
    if (!rightRef.current) return; // typescript check

    let arr = await fs.readBinaryFile(imageSrc.right);

    let im = vips.Image.newFromBuffer(arr);
    console.time("compress");
    let outBuffer;

    if (imageType === "jpeg") {
      outBuffer = im.jpegsaveBuffer({
        Q: quality,
        strip: true,
      });
    } else if (imageType === "png") {
      outBuffer = im.pngsaveBuffer({
        Q: quality,
        strip: true,
      });
    } else {
      outBuffer = im.webpsaveBuffer({
        Q: quality,
        strip: true,
      });
    }

    console.timeEnd("compress");

    const blob = new Blob([outBuffer], { type: "image/jpeg" });
    const blobURL = URL.createObjectURL(blob);
    rightRef.current.src = blobURL;

    let size =
      (await fetch(blobURL).then((x) => x.headers.get("content-length"))) || 0;
    setSizes({ ...sizes, conv: (Number(size) / 1024).toFixed(2) });
    setDownloadBlob(blob);
  };

  const selectImage = () => {
    dialog
      .open({
        multiple: false,
        title: "Select an Image",
        directory: false,
      })
      .then(async (p) => {
        let path = p as string;
        let size =
          (await fetch(convertFileSrc(path))
            .then((x) => x.blob())
            .then((d) => d.size)) || 0;
        setSizes({ ...sizes, og: (Number(size) / 1024).toFixed(2) });
        setImageSrc({
          left: path,
          right: path,
        });
      })
      .catch((e) => {
        console.log("Something went wrong, while selecting image", e);
      });
  };

  return (
    <Flex
      ref={parentRef}
      h="100%"
      w="100%"
      justify={"center"}
      flexDir="column"
      gap="10"
      p="5"
      boxSizing="border-box"
    >
      {imageSrc.left ? (
        <Box>
          <ReactCompareSlider
            style={{
              height: "90vh",
            }}
            onlyHandleDraggable={true}
            itemOne={
              <img
                style={{
                  ...styleFitContainer(),
                }}
                src={convertFileSrc(imageSrc.left)}
                alt="Left"
              />
            }
            itemTwo={
              <img
                style={{
                  ...styleFitContainer(),
                }}
                src={convertFileSrc(imageSrc.right)}
                alt="right"
                ref={rightRef}
              />
            }
          />
        </Box>
      ) : null}
      <Flex justify={"center"} gap="10">
        <Button onClick={selectImage} bg="red.500">
          Select image
        </Button>
        {imageSrc.right ? (
          <Button onClick={download} bg="red.500">
            Save
          </Button>
        ) : null}
      </Flex>

      {imageSrc.right ? (
        <Box
          as={motion.div}
          drag
          dragConstraints={parentRef}
          w="300px"
          position={"absolute"}
          borderRadius="lg"
          shadow={"2xl"}
          bg="gray.700"
          right="10"
          bottom={"10"}
          p="4"
        >
          <VStack align={"left"} gap="2">
            <Select
              value={imageType}
              onChange={(e) => {
                setImageType(e.target.value as "webp" | "jpeg" | "png");
              }}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </Select>
            <Divider />
            <Slider
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onChangeEnd={resize}
              min={0}
              max={100}
              value={quality}
              onChange={(e) => {
                setQuality(e);
              }}
              aria-label="slider-ex-1"
              defaultValue={30}
            >
              <Tooltip
                hasArrow
                bg="red.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={`Quality: ${quality}%`}
              >
                <SliderThumb />
              </Tooltip>
              <SliderTrack>
                <SliderFilledTrack bg={"red.500"} />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Box>
              <Text>Original: {sizes.og}kb</Text>{" "}
              <Text>Converted: {sizes.conv}kb</Text>
            </Box>
          </VStack>
        </Box>
      ) : null}
    </Flex>
  );
}

export default Image;

// TODO:
// generate thumbnail? https://www.libvips.org/API/current/Using-vipsthumbnail.md.html
// show changed sizes in red/green color and/or icons up/down arrow
// strip as a state, more params
