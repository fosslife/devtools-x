import { Button, Popover, Stack, Text } from "@mantine/core";
import { titleCase } from "@/utils/strings";
import MdPreview from "@/Features/markdown/MarkdownPreview";
import type { ReadmeTemplates } from "./types";

const MarkdownInsertion = ({
  toggle,
  opened,
  callback,
  addPart,

  templates,
}: {
  toggle: () => void;
  opened: boolean;

  callback?: () => void;
  addPart: (title: string, template: string) => void;
  templates: ReadmeTemplates;
}) => {
  return (
    <Popover opened={opened} onChange={toggle}>
      <Popover.Target>
        <Button onClick={toggle}>Add section</Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack
          style={{
            maxHeight: "60vh",
            maxWidth: "300px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {Object.keys(templates).map((key) => {
            const template = templates[key as keyof typeof templates];
            const isStringTemplate = typeof template === "string";
            const renderTitle = !isStringTemplate && template?.renderTitle;
            const renderTemplate = isStringTemplate
              ? template
              : template?.render;

            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  addPart(key, renderTemplate);
                  toggle();
                  callback?.();
                }}
              >
                <RenderTemplatePart
                  renderTemplate={renderTemplate}
                  renderTitle={renderTitle ? key : undefined}
                />
              </div>
            );
          })}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

const RenderTemplatePart = ({
  renderTemplate,
  renderTitle,
}: {
  renderTemplate: string;
  renderTitle?: string;
}) => (
  <div
    style={{
      pointerEvents: "none",
    }}
  >
    {renderTitle ? (
      <Text
        size="xs"
        fw="bold"
        style={{
          textAlign: "center",
          background: "#eee",
          color: "#333",
        }}
      >
        {titleCase(renderTitle)}
      </Text>
    ) : (
      <MdPreview
        source={renderTemplate}
        style={{
          fontSize: "0.8em",
          maxHeight: "200px",
          overflow: "hidden",
          padding: 5,
        }}
      />
    )}
  </div>
);

export default MarkdownInsertion;
