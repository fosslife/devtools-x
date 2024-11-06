import { Button, Group, Stack } from "@mantine/core";
import { useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

export default function PdfReader() {
  const [path, setPath] = useState<string>();

  const openFile = async () => {
    setPath(undefined);
    let path = await open({
      directory: false,
      multiple: false,
    });

    if (path) {
      setPath(path);
    }
  };

  if (!path) return <Button onClick={openFile}>Open file</Button>;

  return (
    <Stack
      w="100%"
      h={"100%"}
      style={{
        overflow: "auto",
      }}
    >
      <Group
        style={{
          position: "absolute",
          bottom: 15,
          zIndex: 100,
          backgroundColor: "var(--mantine-color-dark-4)",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0)",
          padding: "10px",
          right: 0,
        }}
      >
        <Button size="xs" onClick={openFile}>
          Open new
        </Button>
      </Group>
      {/* <div>
        <Document onLoadSuccess={onDocumentLoadSuccess} file={pdf}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              scale={scale}
              className={classes.page}
              pageIndex={index + 1}
              inputRef={(ref) => {
                if (ref && page === index + 1)
                  ref.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={600}
              loading={<Box>loading</Box>}
            />
          ))}
        </Document>
      </div> */}
      <object
        style={{
          width: "100%",
          height: "100%",
        }}
        aria-label="PDF document"
        type="application/pdf"
        data={convertFileSrc(path as string)}
      />
    </Stack>
  );
}
