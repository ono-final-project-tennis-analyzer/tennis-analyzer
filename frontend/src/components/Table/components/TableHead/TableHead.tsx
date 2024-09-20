import React from "react";
import { Checkbox, rem, Table as TableM } from "@mantine/core";
import Styles from "./TableHead.styles.module.css";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import {
  BaseCellData,
  TableCell,
  TableColumn,
  TableSort,
} from "@/components/Table";

interface Props<T extends BaseCellData> {
  hasSelection?: boolean;
  selection?: string[];
  data: T[];
  sort: TableSort<T>;
  toggleAll: VoidFunction;
  actions?: (cell: TableCell<T>) => React.ReactNode;
  columns: TableColumn<T>[];
  schemeSet: Set<string>;
  onSort: (value: keyof T) => void;
}

function TableHead<T extends BaseCellData>({
  data,
  hasSelection,
  selection,
  sort,
  toggleAll,
  actions,
  columns,
  schemeSet,
  onSort,
}: Props<T>) {
  return (
    <TableM.Thead className={Styles.head}>
      <TableM.Tr>
        {hasSelection ? (
          <TableM.Th style={{ width: rem(40) }} className={Styles.noResize}>
            <Checkbox
              size={rem(16)}
              onChange={toggleAll}
              checked={
                selection!.length > 0 && selection!.length >= data.length
              }
              indeterminate={
                selection!.length > 0 && selection!.length < data.length
              }
            />
          </TableM.Th>
        ) : null}
        {columns.map((column, index) => (
          <TableM.Th
            key={`column-${index}`}
            style={{
              width: column.width,
              maxWidth: column.maxWidth,
              minWidth: column.minWidth,
            }}
          >
            <span>{column.header}</span>
            {column.accessor && schemeSet.has(String(column.accessor)) ? (
              <span
                onClick={() => onSort(column.accessor as keyof T)}
                className={Styles.sortItem}
              >
                {sort.sortBy && column.accessor === sort.sortBy ? (
                  sort.direction === "ascending" ? (
                    <IconChevronUp
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  ) : (
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  )
                ) : null}
                {!sort.sortBy || column.accessor !== sort.sortBy ? (
                  <IconSelector
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                ) : null}
              </span>
            ) : null}
          </TableM.Th>
        ))}
        {actions ? (
          <TableM.Th style={{ width: rem(40) }} className={Styles.noResize} />
        ) : null}
      </TableM.Tr>
    </TableM.Thead>
  );
}

export default TableHead;
