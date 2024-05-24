import classes from "./styles.module.css";
import {
  ActionIcon,
  Button,
  Group,
  ScrollArea,
  Select,
  Stack,
  TextInput,
  Divider,
  rem,
  Text
} from "@mantine/core";
import { FakerInput } from "./FakerInput"
import { useState } from "react";
import { faker } from "@faker-js/faker";
import { Monaco } from "../../Components/MonacoWrapper";
import {
  MdOutlineRemove,
  MdOutlineClose,
  MdOutlineWarning,
  MdOutlineCheck,
} from "react-icons/md";
import { notifications } from "@mantine/notifications";
import { allLocales } from "@faker-js/faker";

const errorIcon = <MdOutlineClose style={{ width: rem(20), height: rem(20) }} />;
const successIcon = <MdOutlineCheck style={{ width: rem(20), height: rem(20) }} />;
const warningIcon = <MdOutlineWarning style={{ width: rem(20), height: rem(20) }} />;

const formats = [
  { format: "json", label: "JSON" },
  { format: "sql", label: "SQL" },
  { format: "csv", label: "CSV" },
];

const generateRandomData = (categoryName: string, subsetName: string): any => {
  if ((faker as any)[categoryName] && typeof (faker as any)[categoryName][subsetName] === 'function') {
    return (faker as any)[categoryName][subsetName]();
  } else {
    throw new Error(`Invalid category or subset: ${categoryName}.${subsetName}`);
  }
};

export const getFakeLocales = (): string[] => {
  return Object.keys(allLocales);
};

interface Field {
  fieldName: string,
  category: string,
  dataType: string,
}

export default function Faker() {
  const [fakeLocale, setFakeLocale] = useState<string>('en_US');
  const [format, setFormat] = useState<string | null>("json");
  const [fields, setFields] = useState<Field[]>([{ fieldName: '', category: '', dataType: '' }]);
  const [tableName, setTableName] = useState<string>('table-1');
  const [rowCount, setRowCount] = useState<number>(10);

  const handleAdd = () => {
    setFields([...fields, { fieldName: '', category: '', dataType: '' }]);
  };

  const handleRemove = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldNameChange = (index: number, name: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].fieldName = name || '';
    setFields(updatedFields);
  };

  const handleCategoryChange = (index: number, category: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].category = category || '';
    setFields(updatedFields);
  };

  const handleSubsetChange = (index: number, dataType: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].dataType = dataType || '';
    setFields(updatedFields);
  };

  function handleGenerate() {
    if (validateFields()) {
      notifications.show({
        icon: successIcon,
        title: 'Success',
        message: 'Generated.',
        color: "green",
      })
    }
  };

  const objectFromField = (field: Field) => {

  };

  const validateFields = () => {
    if (fields.length < 1) {
      notifications.show({
        icon: warningIcon,
        title: 'Warning',
        message: 'Add at least on field.',
        color: "orange",
      })
      return false;
    }
    fields.forEach((field, index) => {
      if (!field.fieldName || field.category || field.dataType) {
        notifications.show({
          icon: warningIcon,
          title: 'Warning',
          message: `Field ${index + 1} is not valid. All properties are required.`,
          color: "orange",
        })
        return false
      }
    });
    return true;
  };

  return (
    <Stack h="100%">
      <Group className={classes.parent}>
        <Stack style={{ height: "100%", width: "100%" }}>
          <Group >
            <Text>Locale: </Text>
            <Select
              value={fakeLocale}
              data={getFakeLocales().map((l) => ({
                value: l,
                label: l,
              }))}
            />
            <Text># Rows: </Text>
            <TextInput value={rowCount} />
            <Text>Format: </Text>
            <Select
              value={format}
              allowDeselect={false}
              onChange={setFormat}
              data={formats.map((l) => ({
                value: l.format,
                label: l.label,
              }))}
            />
            {format === 'sql' ? <Group><Text>Format: </Text> <TextInput value={tableName} placeholder="Table name" /></Group> : null}
            <Button onClick={handleGenerate}>Generate</Button>
          </Group>
          <Divider size="xs" my="xs" />
          <Group wrap="nowrap" style={{ height: "100%", width: "100%" }}>
            <Stack justify="flex-start" h="100%" w="45%">
              <ScrollArea.Autosize mah="90%" type="always" >
                {fields.map((item, index) => (
                  <Group key={index} style={{ marginBottom: '1rem' }}>
                    <Text>{index + 1}</Text>
                    <FakerInput
                      fieldName={item.fieldName}
                      category={item.category}
                      dataType={item.dataType}
                      onFieldNameChange={(fieldName: string | null) => handleFieldNameChange(index, fieldName)}
                      onCategoryChange={(category: string | null) => handleCategoryChange(index, category)}
                      onDataTypeChange={(subset: string | null) => handleSubsetChange(index, subset)}
                    />
                    <ActionIcon onClick={() => handleRemove(index)} variant="default" aria-label="Settings">
                      <MdOutlineRemove style={{ width: '70%', height: '70%' }} />
                    </ActionIcon>
                  </Group>
                ))}
                {/* <pre>{JSON.stringify(fields, null, 2)}</pre> For debugging */}
              </ScrollArea.Autosize>
              <Button onClick={handleAdd}>Add Another Field</Button>
            </Stack>
            <Monaco
              height="100%"
              width="55%"
              language={
                formats.find((l) => l.format === format)?.format || "text"
              }
              value={'{}'}
              extraOptions={{
                readOnly: true,
              }}
            />
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}
