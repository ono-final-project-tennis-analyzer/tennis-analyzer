import { Checkbox, rem, Table as TableM } from "@mantine/core";
import React from "react";
import { BaseCellData, TableCell, TableColumn } from "@/components/Table";
import cx from "clsx";
import Styles from "./TableBody.styles.module.css";
import ActionRow from "@/components/Table/components/ActionRow";

interface Props<T extends BaseCellData> {
  data: T[];
  hasSelection: boolean;
  selectionSet: Set<string>;
  actions?: (cell: TableCell<T>) => React.ReactNode;
  toggleRow: (id: string) => void;
  columns: TableColumn<T>[];
  noResultsText?: string;
}

function TableBody<T extends BaseCellData>({
  data,
  hasSelection,
  selectionSet,
  actions,
  toggleRow,
  columns,
  noResultsText = "No results to display...",
}: Props<T>) {
  const rows = data.map((item, index) => {
    const selected = hasSelection && selectionSet.has(item.id);

    const cell: TableCell<T> = {
      index,
      data: item,
    };

    const itemAction = actions?.(cell);

    return (
      <TableM.Tr
        key={item.id}
        className={cx({ [Styles.rowSelected]: selected })}
        data-testid="table-row"
      >
        {hasSelection ? (
          <TableM.Td>
            <Checkbox
              checked={selected}
              onChange={() => toggleRow(item.id)}
              size={rem(16)}
            />
          </TableM.Td>
        ) : null}

        {columns.map((column, columnIndex) => (
          <TableM.Td key={`row-${index}-${columnIndex}`}>
            <div onClick={() => column.onClick?.(cell)} className={Styles.cell}>
              {typeof column.renderRow === "string"
                ? String(item[column.renderRow])
                : null}
              {typeof column.renderRow === "function"
                ? column.renderRow(cell)
                : null}
            </div>
          </TableM.Td>
        ))}
        {itemAction ? (
          <TableM.Td>
            <ActionRow>{itemAction}</ActionRow>
          </TableM.Td>
        ) : null}
      </TableM.Tr>
    );
  });

  return (
    <TableM.Tbody>
      {rows.length > 0 ? (
        rows
      ) : (
        <TableM.Td
          className={Styles.noResults}
          align="center"
          colSpan={columns.length}
        >
          {noResultsText}
        </TableM.Td>
      )}
    </TableM.Tbody>
  );
}

export default TableBody;
