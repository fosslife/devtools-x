import {
    Button,
    Group,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

// Function to get categories and their subsets dynamically
const getCategoriesAndSubsets = () => {
    const categories: { [key: string]: string[] } = {};

    for (const categoryKey in faker) {
        if (typeof (faker as any)[categoryKey] === 'object' && (faker as any)[categoryKey] !== null) {
            const subsets = Object.keys((faker as any)[categoryKey])
                .filter(subsetKey => typeof (faker as any)[categoryKey][subsetKey] === 'function');
            if (subsets.length > 0) {
                categories[categoryKey] = subsets;
            }
        }
    }

    return categories;
};

const getCategoryNames = (): string[] => {
    const categories = getCategoriesAndSubsets();
    return Object.keys(categories);
};

// Function to get subsets for a given category name
const getSubsetsForCategory = (categoryName: string): string[] => {
    const categories = getCategoriesAndSubsets();
    return categories[categoryName] || [];
};

console.log(getCategoryNames());
//console.log(getSubsetsForCategory("animal"));

export default function FakerInput() {
    const [category, setCategory] = useState<string | null>("datatype");
    const [categoryTypes, setCategoryTypes] = useState<string[]>([]);
    const [dataType, setDataType] = useState<string | null>("uuid");

    useEffect(() => {
        if (category) {
            const subsets = getSubsetsForCategory(category);
            setCategoryTypes(subsets);
            setDataType(null); // Reset subset selection when category changes
        }
    }, [category]);

    return (
        <Group>
            <TextInput placeholder="Field name" />
            <Select
                value={category}
                allowDeselect={false}
                onChange={setCategory}
                placeholder="Category"
                data={getCategoryNames()} />
            <Select
                value={dataType}
                onChange={setDataType}
                placeholder="Subset"
                data={categoryTypes.map(name => ({ value: name, label: name }))}
                disabled={!category}
            />
        </Group>
    );
}