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
import { useCallback, useEffect, useState } from "react";
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
import YAML from "js-yaml";
import { delimiter } from "@tauri-apps/api/path";
import { event } from "@tauri-apps/api";

const errorIcon = <MdOutlineClose style={{ width: rem(20), height: rem(20) }} />;
const successIcon = <MdOutlineCheck style={{ width: rem(20), height: rem(20) }} />;
const warningIcon = <MdOutlineWarning style={{ width: rem(20), height: rem(20) }} />;

const formats = [
  { format: "json", label: "JSON" },
  { format: "yaml", label: "YAML" },
  { format: "sql", label: "SQL" },
  { format: "csv", label: "CSV" },
];

const getMockData = (category: string, dataType: string): any => {
  if ((faker as any)[category] && typeof (faker as any)[category][dataType] === 'function') {
    return (faker as any)[category][dataType]();
  } else {
    throw new Error(`Invalid category or subset: ${category}.${dataType}`);
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
  const [fields, setFields] = useState<Field[]>([{ fieldName: 'id', category: 'datatype', dataType: 'uuid' }]);
  const [tableName, setTableName] = useState<string>('table-1');
  const [rowCount, setRowCount] = useState<number>(10);
  const [csvDelimiter, setCsvDelimiter] = useState<string>(",");
  const [output, setOutput] = useState<string>();

  const tableNameChange = (event: any) => {
    console.log(event.target.value);
    setTableName(event.target.value);
  }

  const rowCountChange = (event: any) => {
    console.log(event.target.value);
    setRowCount(parseInt(event.target.value)) // Check non integer values
  }

  const csvDelimiterChange = (event: any) => {
    console.log(event.target.value);
    setCsvDelimiter(event.target.value);
  }

  const addField = () => {
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

  const generate = useCallback(async () => {
    if (validateFields()) {
      if (format === "json" || format === "yaml") {
        let data = [];
        for (let i = 0; i < rowCount; i++) {
          data.push(objectFromFields(fields))
        }
        if (format !== "yaml") {
          let input = JSON.stringify(data, undefined, 2);
          setOutput(input);
          return;
        }
        setOutput(YAML.dump(data, {
          indent: 2,
        }))
      }
      if (format === "csv") {
        let output = ""
        for (let i = 0; i < rowCount; i++) {
          output += csvRowFromFields(fields, csvDelimiter) + "\n";
        }
        setOutput(output);
      }
    }
  }, [rowCount, fields, format, csvDelimiter]);

  const objectFromFields = (fields: Field[]) => {
    let obj: { [key: string]: any } = {};
    fields.forEach(f => {
      try {
        obj[f.fieldName] = getMockData(f.category, f.dataType);
      } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error);
        showError("Faker Error", message);
      }
    });
    return obj;
  };

  /**
   * Simply quotes a string of it contains the CSV delimeter
   * 
   * @param value The string value to be made safe
   * @param delimeter The deleimeter to check for in the string
   */
  const csvSafe = (value: string, delimeter: string) => {
    if (value.includes(delimeter)) return `"${value}"`
    return value;
  };

  const csvRowFromFields = (fields: Field[], delimeter: string) => {
    let line: string = "";
    fields.forEach(f => {
      try {
        line += `${csvSafe(getMockData(f.category, f.dataType), delimeter)} ${delimeter}`;
      } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error);
        showError("Faker Error", message);
      }
    });
    console.log(line);
    return line.slice(0, -1); // remove trailing delimeter
  };

  const showError = (title: string, message: string) => {
    notifications.show({
      icon: errorIcon,
      title: title,
      message: message,
      color: "red",
    })
  }

  const validInput = (val: string) => {
    return ![null, undefined, ''].includes(val);
  }

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
      if (!validInput(field.fieldName) || !validInput(field.category) || !validInput(field.dataType)) {
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
            <TextInput onChange={rowCountChange} defaultValue={rowCount} />
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
            {format === 'sql' ? <Group><Text>Table Name: </Text> <TextInput onChange={tableNameChange} defaultValue={tableName} /></Group> : null}
            {format === 'csv' ? <Group><Text>CSV Delimiter: </Text> <TextInput onChange={csvDelimiterChange} defaultValue={csvDelimiter} /></Group> : null}
            <Button onClick={generate}>Generate</Button>
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
                <pre>{JSON.stringify(fields, null, 2)}</pre>
              </ScrollArea.Autosize>
              <Button onClick={addField}>Add Another Field</Button>
            </Stack>
            <Monaco
              height="100%"
              width="55%"
              language={
                formats.find((l) => l.format === format)?.format || "text"
              }
              value={output}
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
