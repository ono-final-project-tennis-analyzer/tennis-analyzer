import { useMemo, useState } from "react";
import { BaseCellData, TableSort } from "../@Table.types.ts";

interface Props<T extends BaseCellData> {
  defaultSort?: TableSort<T>;
  data: T[];
}

export default function useTableSort<T extends BaseCellData>({
  data,
  defaultSort,
}: Props<T>) {
  const [sort, setSort] = useState<TableSort<T>>(
    defaultSort ?? {
      sortBy: "",
      direction: "",
    },
  );

  const onSort = (value: keyof T) => {
    if (sort.sortBy === value) {
      setSort({
        sortBy: sort.sortBy,
        direction: sort.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSort({
        sortBy: value,
        direction: "ascending",
      });
    }
  };

  const sortedData = useMemo(() => {
    if (!sort.sortBy || !sort.direction) return data;
    const sortKey = sort.sortBy as keyof T;

    return data.sort((item1, item2) => {
      if (
        typeof item1[sortKey] === "number" &&
        typeof item2[sortKey] === "number"
      ) {
        return sort.direction === "ascending"
          ? Number(item1[sortKey]) - Number(item2[sortKey])
          : Number(item2[sortKey]) - Number(item1[sortKey]);
      }

      if (String(item1[sortKey]) > item2[sortKey])
        return sort.direction === "ascending" ? 1 : -1;
      if (String(item1[sortKey]) < item2[sortKey])
        return sort.direction === "ascending" ? -1 : 1;
      return 0;
    });
  }, [sort, data]);

  const schemeSet = useMemo(
    () => new Set(data.length > 0 ? Object.keys(data[0]) : []),
    [data],
  );

  return {
    sort,
    onSort,
    sortedData,
    schemeSet,
  };
}
