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
import { assert } from "quicktype-core";

const errorIcon = <MdOutlineClose style={{ width: rem(20), height: rem(20) }} />;
const warningIcon = <MdOutlineWarning style={{ width: rem(20), height: rem(20) }} />;

/**
 * Supported output formats
 */
const outputFormats = [
  { format: "json", label: "JSON" },
  { format: "yaml", label: "YAML" },
  { format: "sql", label: "SQL" },
  { format: "csv", label: "CSV" },
];

/**
 * Generates a mock data using @faker-js/faker based on given data category and type
 * 
 * @param category The category for which the fake data falls within
 * @param dataType The specific data type to be fakes
 * @returns The faker generated data
 */
const getMockData = (category: string, dataType: string, locale: string | null): any => {
  const actualLocale = locale || 'en_US';
  console.log(`mocking: ${actualLocale}`);

  if ((faker as any)[category] && typeof (faker as any)[category][dataType] === 'function') {
    return (faker as any)[category][dataType]();
  } else {
    throw new Error(`Invalid category or subset: ${category}.${dataType}`);
  }
};

const getFakerLocales = (): string[] => {
  return Object.keys(allLocales);
};

interface Field {
  fieldName: string,
  category: string,
  dataType: string,
}

export default function Faker() {
  const [fakerLocale, setFakerLocale] = useState<string | null>('en_US');
  const [outputFormat, setOutputFormat] = useState<string | null>("json");
  const [fields, setFields] = useState<Field[]>([{ fieldName: 'id', category: 'datatype', dataType: 'uuid' }]);
  const [tableName, setTableName] = useState<string>('table-1');
  const [rowCount, setRowCount] = useState<number>(10);
  const [csvDelimiter, setCsvDelimiter] = useState<string>(",");
  const [output, setOutput] = useState<string>();

  // #region Change Handlers
  const rowCountChange = (event: any) => {
    setRowCount(parseInt(event.target.value)) // TODO: Check non-integer values (error)
  }

  const tableNameChange = (event: any) => {
    setTableName(event.target.value);
  }

  const csvDelimiterChange = (event: any) => {
    setCsvDelimiter(event.target.value);
  }

  const fieldNameChange = (index: number, name: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].fieldName = name || '';
    setFields(updatedFields);
  };

  const fieldCategoryChange = (index: number, category: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].category = category || '';
    setFields(updatedFields);
  };

  const fieldDataTypeChange = (index: number, dataType: string | null) => {
    const updatedFields = [...fields];
    updatedFields[index].dataType = dataType || '';
    setFields(updatedFields);
  };
  // #endregion

  /**
   * Adds a new field to the list of fields along with a corresponding FakeInput Compponent
   */
  const addField = () => {
    setFields([...fields, { fieldName: '', category: '', dataType: '' }]);
  };

  /**
   * Removes a specific FakerInput component form view and corresponding Field from list of fields
   * 
   * @param index The index of the field to remove
   */
  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  /**
   * Generates the mock data in the desired output
   * Determines the output format and uses some helpers and one js-yaml library
   */
  const generate = useCallback(async () => {
    console.log("locale:" + fakerLocale)
    const result = validateFields();
    if (!result.valid) {
      showWarning("Validation Error", result.message);
      return;
    }

    if (outputFormat === "json" || outputFormat === "yaml") {
      let data = [];
      for (let i = 0; i < rowCount; i++) {
        data.push(objectFromFields(fields, fakerLocale))
      }
      if (outputFormat !== "yaml") {
        let input = JSON.stringify(data, undefined, 2);
        setOutput(input);
        return;
      }
      setOutput(YAML.dump(data, {
        indent: 2,
      }))
    }
    if (outputFormat === "csv") {
      let output = ""
      for (let i = 0; i < rowCount; i++) {
        output += csvRowFromFields(fields, csvDelimiter, fakerLocale) + "\n";
      }
      setOutput(output);
      return;
    }
    if (outputFormat == "sql") {
      let output = ""
      for (let i = 0; i < rowCount; i++) {
        output += sqlInsertFromFields(tableName, fields, fakerLocale) + "\n";
      }
      setOutput(output);
      return;
    }
  }, [rowCount, fields, outputFormat, csvDelimiter, tableName, fakerLocale]);


  /**
   * Creates a Javscript object with mock property values from a list of field
   * 
   * @param fields 
   * @returns 
   */
  const objectFromFields = (fields: Field[], locale: string | null) => {
    let obj: { [key: string]: any } = {};
    fields.forEach(f => {
      try {
        obj[f.fieldName] = getMockData(f.category, f.dataType, locale);
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
   * Simply quotes a string if it contains the CSV delimeter
   * 
   * @param value The string value to be made safe
   * @param delimeter The deleimeter to check for in the string
   */
  const csvSafe = (value: string, delimeter: string) => {
    if (value.includes(delimeter)) return `"${value}"`
    return value;
  };

  /**
   * Creates a CSV row with mock data from a list of fields
   * 
   * @param fields The list of fields to be comma-separated
   * @param delimeter Character to distinguish columns
   * @returns 
   */
  const csvRowFromFields = (fields: Field[], delimeter: string, locale: string | null) => {
    let line: string = "";
    fields.forEach(f => {
      try {
        line += `${csvSafe(getMockData(f.category, f.dataType, locale), delimeter)} ${delimeter}`;
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

  const sqlInsertFromFields = (tableName: string, fields: Field[], locale: string | null) => {
    let obj = objectFromFields(fields, locale);
    //array.map(item => `'${item}'`).join(delimiter);
    return `
    INSERT INTO ${tableName} (${Object.keys(obj).join(',')}) 
    VALUES(${Object.values(obj).map(item => `'${item}'`).join(',')});`;
  };

  /**
   * Checks is a not empty, undefined or null
   * 
   * @param val The string to validate
   * @returns boolean result of validation
   */
  const validString = (val: string | null) => {
    return ![null, undefined, ''].includes(val);
  }

  type ValidResult = { valid: true; };
  type InvalidResult = { valid: false; message: string; }; // Error message needed only if validation fails
  type ValidationResult = ValidResult | InvalidResult;

  /**
   * Validate the list of fields
   * Check that the list is not empty and that each field's entries are non-empty strings
   * 
   * @returns ValidationResult Result of the validation. It included and error message if validation is false
   */
  const validateFields = (): ValidationResult => {
    if (fields.length < 1) {
      return {
        valid: false,
        message: 'Add at least on field.'
      }
    }
    fields.forEach((field, index) => {
      if (!validString(field.fieldName) || !validString(field.category) || !validString(field.dataType)) {
        return {
          valid: false,
          message: `Field ${index + 1} is not valid. All properties are required.`,
        }
      }
    });
    return { valid: true };
  };

  /**
   * Shows error notification in a toast dialog
   * 
   * @param title The title of the toast
   * @param message Message to be included the content of the notification
   */
  const showError = (title: string, message: string) => {
    notifications.show({
      icon: errorIcon,
      title: title,
      message: message,
      color: "red",
    })
  }

  /**
 * Shows warning notification in a toast dialog
 * 
 * @param title The title of the toast
 * @param message Message to be included the content of the notification
 */
  const showWarning = (title: string, message: string) => {
    notifications.show({
      icon: warningIcon,
      title: title,
      message: message,
      color: "orange",
    })
  }

  return (
    <Stack h="100%">
      <Group className={classes.parent}>
        <Stack style={{ height: "100%", width: "100%" }}>
          <Group >
            <Text>Locale: </Text>
            <Select
              value={fakerLocale}
              allowDeselect={false}
              onChange={setFakerLocale}
              data={getFakerLocales().map((l) => ({
                value: l,
                label: l,
              }))}
            />
            <Text># Rows: </Text>
            <TextInput onChange={rowCountChange} defaultValue={rowCount} />
            <Text>Format: </Text>
            <Select
              value={outputFormat}
              allowDeselect={false}
              onChange={setOutputFormat}
              data={outputFormats.map((l) => ({
                value: l.format,
                label: l.label,
              }))}
            />
            {outputFormat === 'sql' ? <Group><Text>Table Name: </Text> <TextInput onChange={tableNameChange} defaultValue={tableName} /></Group> : null}
            {outputFormat === 'csv' ? <Group><Text>CSV Delimiter: </Text> <TextInput onChange={csvDelimiterChange} defaultValue={csvDelimiter} /></Group> : null}
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
                      onFieldNameChange={(fieldName: string | null) => fieldNameChange(index, fieldName)}
                      onCategoryChange={(category: string | null) => fieldCategoryChange(index, category)}
                      onDataTypeChange={(subset: string | null) => fieldDataTypeChange(index, subset)}
                    />
                    <ActionIcon onClick={() => removeField(index)} variant="default" aria-label="Settings">
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
                outputFormats.find((l) => l.format === outputFormat)?.format || "text"
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
