import { Box, Button, Group, Stack } from "@mantine/core";
import { open, save } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import { writeBinaryFile } from "@tauri-apps/api/fs";

export default function ImageCrop() {
  const [imageSrc, setImageSrc] = useState("");

  const cropperRef = useRef<ReactCropperElement>(null);

  const onSelectImage = async () => {
    const path = await open({
      directory: false,
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
      multiple: false,
      title: "Select Image",
    });
    if (path) {
      const asset = convertFileSrc(path as string);
      console.log(asset);
      setImageSrc(asset);
    }
  };

  const saveImage = async () => {
    if (!cropperRef.current) {
      return;
    }

    cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob) => {
      console.log(blob);
      if (!blob) {
        return;
      }
      const path = await save({
        defaultPath: "iamage.png",
        filters: [{ name: "Images", extensions: ["png"] }],
        title: "Save Image",
      });

      if (path) {
        writeBinaryFile({
          path: path as string,
          contents: new Uint8Array(await blob.arrayBuffer()),
        });
      }
    });
  };

  return (
    <Stack
      h="100%"
      pb="xl"
      mb="xl"
      style={{
        overflow: "auto",
      }}
    >
      <Group>
        <Button w="fit-content" onClick={onSelectImage}>
          Select Image
        </Button>
        <Button
          display={imageSrc ? "block" : "none"}
          w="fit-content"
          onClick={saveImage}
        >
          Save
        </Button>
      </Group>
      <Group w="100%" align="start" wrap="nowrap">
        {imageSrc && (
          <Box pos={"relative"} w={"50%"}>
            <Cropper
              src={imageSrc}
              height={600}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              ref={cropperRef}
              style={{ height: "fit-content", width: "100%" }}
              viewMode={1}
            />
          </Box>
        )}
      </Group>
      <Group>
        {" "}
        <Box
          className="img-preview"
          h="300px"
          w="100%"
          style={{
            overflow: "hidden",
          }}
        ></Box>
      </Group>
    </Stack>
  );
}
