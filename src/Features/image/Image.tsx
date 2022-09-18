import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  NativeSelect,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { dialog, fs } from "@tauri-apps/api";
import { save } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useRef, useState } from "react";
import { ReactCompareSlider, styleFitContainer } from "react-compare-slider";

function Image() {
  let rightRef = useRef<HTMLImageElement>(null);
  const [downloadBlob, setDownloadBlob] = useState<Blob>();
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(50);
  const [doubouncedQuality] = useDebouncedValue(quality, 500);
  const [imageType, setImageType] = useState<"webp" | "jpeg" | "png" | string>(
    "webp"
  );

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

    if (!imageSrc.left) return;
    if (!rightRef.current) return; // typescript check

    console.log("Resize: all checks pass");
    setLoading(true);
    let arr = await fs.readBinaryFile(imageSrc.right);
    console.log("Quality", quality);

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
    setLoading(false);
  };

  const selectImage = () => {
    console.log("selecting image");
    dialog
      .open({
        multiple: false,
        title: "Select an Image",
        directory: false,
      })
      .then(async (p) => {
        if (!p) return; // no path
        let path = p as string;
        console.log("Got image", p);
        let size =
          (await fetch(convertFileSrc(path))
            .then((x) => x.blob())
            .then((d) => d.size)
            .catch((err) =>
              console.error("Error while selecting image", err)
            )) || 0;
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

  useEffect(() => {
    resize();
  }, [doubouncedQuality]);

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      {imageSrc.left ? (
        <Box>
          <LoadingOverlay visible={loading} overlayBlur={2} />
          <ReactCompareSlider
            style={{
              height: "80vh",
            }}
            onlyHandleDraggable={true}
            itemOne={
              <img
                style={{
                  ...styleFitContainer(),
                  objectFit: "contain",
                }}
                src={convertFileSrc(imageSrc.left)}
                alt="Left"
              />
            }
            itemTwo={
              <img
                style={{
                  ...styleFitContainer(),
                  objectFit: "contain",
                }}
                src={convertFileSrc(imageSrc.right)}
                alt="right"
                ref={rightRef}
              />
            }
          />
        </Box>
      ) : null}
      <Group align={"center"} position="center">
        <Button onClick={selectImage}>Select image</Button>
        {imageSrc.right ? <Button onClick={download}>Save</Button> : null}
      </Group>

      {imageSrc.right ? (
        <Box sx={{ position: "relative" }}>
          <Stack
            align={"left"}
            spacing="sm"
            sx={(theme) => ({
              position: "absolute",
              right: 10,
              bottom: 40,
              backgroundColor: theme.colors.dark[8],
              padding: 15,
              borderRadius: 9,
              width: 250,
            })}
          >
            <NativeSelect
              value={imageType}
              data={["jpeg", "png", "webp"]}
              onChange={(e) => {
                setImageType(e.currentTarget.value);
              }}
            ></NativeSelect>
            <Divider />

            <Slider
              min={0}
              max={100}
              value={quality}
              onChange={(e) => {
                setQuality(e);
              }}
              label={quality + "%"}
              aria-label="slider-ex-1"
              defaultValue={30}
              labelTransition="skew-down"
              labelTransitionDuration={150}
              labelTransitionTimingFunction="ease"
            ></Slider>
            <Box>
              <Text color={"blue"}>Original: {sizes.og}kb</Text>{" "}
              <Text
                color={Number(sizes.conv) > Number(sizes.og) ? "red" : "green"}
              >
                Converted: {sizes.conv}kb
              </Text>
            </Box>
          </Stack>
          {imageSrc.left && (
            <Text color={"dimmed"} size="xs">
              NOTE: Not recommended using extremly large images like 8k or so
              on. full HD images and below should work fine
            </Text>
          )}
        </Box>
      ) : null}
    </Stack>
  );
}

export default Image;

// TODO:
// generate thumbnail? https://www.libvips.org/API/current/Using-vipsthumbnail.md.html
// show changed sizes in red/green color and/or icons up/down arrow
// strip as a state, more params
