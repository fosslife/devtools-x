import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Group, Select, TextInput } from "@mantine/core";

// Function to get categories and their subsets dynamically
const getCategoriesAndSubsets = () => {
  const categories: { [key: string]: string[] } = {};

  for (const categoryKey in faker) {
    if (
      typeof (faker as any)[categoryKey] === "object" &&
      (faker as any)[categoryKey] !== null
    ) {
      const subsets = Object.keys((faker as any)[categoryKey]).filter(
        (subsetKey) =>
          typeof (faker as any)[categoryKey][subsetKey] === "function"
      );
      if (subsets.length > 0) {
        categories[categoryKey] = subsets;
      }
    }
  }

  return categories;
};

const getCategoryNames = (): string[] => {
  const categories = getCategoriesAndSubsets();
  return Object.keys(categories).filter((value) => {
    return value != "_randomizer" && value != "helpers";
  });
};

console.log(getCategoryNames());

const getDataTypesForCategory = (categoryName: string): string[] => {
  const categories = getCategoriesAndSubsets();
  return categories[categoryName] || [];
};

interface FakeInputProps {
  fieldName: string;
  category: string;
  dataType: string;
  onFieldNameChange: (category: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onDataTypeChange: (dataType: string | null) => void;
}

export const FakerInput: React.FC<FakeInputProps> = ({
  fieldName,
  category,
  dataType,
  onFieldNameChange,
  onCategoryChange,
  onDataTypeChange,
}) => {
  const [dataTypes, setDataTypes] = useState<string[]>([]);

  useEffect(() => {
    if (category) {
      const dataTypes = getDataTypesForCategory(category);
      setDataTypes(dataTypes);
      if (!dataTypes.includes(dataType || "")) {
        onDataTypeChange("");
      }
    }
  }, [category]);

  return (
    <>
      <TextInput
        value={fieldName}
        placeholder="Field name"
        onChange={(event) =>
          onFieldNameChange(
            event.currentTarget.value !== "" ? event.currentTarget.value : null
          )
        }
      />
      <Select
        value={category || ""}
        allowDeselect={false}
        onChange={(value) => onCategoryChange(value !== "" ? value : null)}
        placeholder="Category"
        data={getCategoryNames().map((name) => ({ value: name, label: name }))}
      />
      <Select
        value={dataType || ""}
        onChange={(value) => onDataTypeChange(value !== "" ? value : null)}
        placeholder="Data type"
        data={dataTypes.map((name) => ({ value: name, label: name }))}
        disabled={!category}
      />
    </>
  );
};
