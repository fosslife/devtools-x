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
  const [vips, setVips] = useState<any>();

  const [sizes, setSizes] = useState({
    og: "0",
    conv: "0",
  });

  const [imageSrc, setImageSrc] = useState({
    left: "",
    right: "",
  });

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    (async () => {
      if (!vips) {
        script = document.createElement("script");
        script.src = "/assets/vips/vips.js";
        document.body.appendChild(script);
        script.onload = () => {
          let Vips = (window as any).Vips;
          new Vips({
            dynamicLibraries: [],
            locateFile: (fileName: string) => {
              return "/assets/vips/" + fileName;
            },
          }).then((v: any) => {
            setVips(v);
          });
        };
      }
    })();

    return () => {
      if (vips) {
        vips.shutdown();
        script?.remove();
      }
    };
  }, []);

  const download = async () => {
    let downloadPath = await save({
      defaultPath: "compressed",
      filters: [{ name: "images", extensions: [imageType] }],
      title: "Select location",
    });

    if (!downloadPath) return;

    let ab = await downloadBlob?.arrayBuffer();

    fs.writeBinaryFile({
      contents: new Uint8Array(ab as ArrayBuffer),
      path: downloadPath,
    });
  };

  const resize = async () => {
    // let { vips } = window as any;

    if (!imageSrc.left) return;
    if (!rightRef.current) return; // typescript check
    if (!vips) return;

    console.debug("Resize: all checks pass");
    setLoading(true);
    let arr = await fs.readBinaryFile(imageSrc.right);
    console.debug("Quality", quality);

    let im = vips.Image.newFromBuffer(arr);
    console.time("compress");
    let outBuffer;

    if (imageType === "jpeg") {
      outBuffer = im.jpegsaveBuffer({
        Q: quality,
      });
    } else if (imageType === "png") {
      outBuffer = im.pngsaveBuffer({
        Q: quality,
      });
    } else {
      outBuffer = im.webpsaveBuffer({
        Q: quality,
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
    console.debug("selecting image");
    dialog
      .open({
        multiple: false,
        title: "Select an Image",
        directory: false,
      })
      .then(async (p) => {
        if (!p) return; // no path
        let path = p as string;
        console.debug("Got image", p);
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
        console.debug("Something went wrong, while selecting image", e);
      });
  };

  useEffect(() => {
    resize();
  }, [doubouncedQuality, sizes.og, imageType, imageSrc.right]);

  return (
    <Stack w="100%" h="100%">
      {imageSrc.left ? (
        <Box>
          <LoadingOverlay
            visible={loading}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
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
      <Group align={"center"} justify="center">
        <Button onClick={selectImage}>Select image</Button>
        {imageSrc.right ? <Button onClick={download}>Save</Button> : null}
      </Group>

      {imageSrc.right ? (
        <Box style={{ position: "relative" }}>
          <Stack
            align={"left"}
            gap="sm"
            style={{
              position: "absolute",
              right: 10,
              bottom: 40,
              backgroundColor: "var(--mantine-color-dark-8)",
              padding: 15,
              borderRadius: 9,
              width: 250,
            }}
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
              labelTransitionProps={{
                transition: "skew-down",
                duration: 150,
                timingFunction: "ease",
              }}
            ></Slider>
            <Box>
              <Text c={"blue"}>Original: {sizes.og}kb</Text>{" "}
              <Text c={Number(sizes.conv) > Number(sizes.og) ? "red" : "green"}>
                Converted: {sizes.conv}kb
              </Text>
            </Box>
          </Stack>
          {imageSrc.left && (
            <Text c={"dimmed"} size="xs">
              NOTE: extremly large images may take a while to load.
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
