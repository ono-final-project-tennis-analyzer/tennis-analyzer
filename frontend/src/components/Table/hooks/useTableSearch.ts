import { useMemo, useState } from "react";
import { BaseCellData, TableCell } from "../@Table.types";

interface Props<T extends BaseCellData> {
  data: T[];
  searchable?: boolean;
  filter?: (term: string, cell: TableCell<T>) => boolean;
  suggestionKeys?: (keyof T)[];
}

export default function useTableSearch<T extends BaseCellData>({
  data,
  searchable,
  filter,
  suggestionKeys,
}: Props<T>) {
  const [searchValue, setSearchValue] = useState("");

  const searchedData = useMemo(() => {
    if (!searchable) return data;

    const term = searchValue.trim().toLowerCase();
    return data.filter((item, index) => {
      for (const value of Object.values(item)) {
        if (filter) {
          return filter(term, { index, data: item });
        }

        const lowerValue = String(value).toLowerCase().trim();
        if (lowerValue.startsWith(term) || term.startsWith(lowerValue)) {
          return true;
        }
      }
      return false;
    });
  }, [data, searchValue]);

  const suggestions = useMemo(() => {
    if (!suggestionKeys) return [];

    const items = searchedData.reduce((items, current) => {
      suggestionKeys.forEach((key) => items.push(String(current[key])));

      return items;
    }, [] as string[]);

    return Array.from(new Set(items)).sort();
  }, [searchedData, suggestionKeys]);

  return {
    searchValue,
    setSearchValue,
    searchedData,
    suggestions,
  };
}
