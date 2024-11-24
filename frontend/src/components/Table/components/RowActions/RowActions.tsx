import React from "react";
import { Menu, rem } from "@mantine/core";
import { TableCell, BaseCellData, RowActionItem } from "../../@Table.types";

interface ActionRowProps<T extends BaseCellData> {
  cell: TableCell<T>;
  items: RowActionItem<T>[];
}

interface SortedItems<T extends BaseCellData> {
  defaultItems: RowActionItem<T>[];
  dangerItems: RowActionItem<T>[];
}

const ActionRow = <T extends BaseCellData>({
  cell,
  items,
}: ActionRowProps<T>) => {
  const { defaultItems, dangerItems } = items.reduce(
    (previousValue, currentValue) => {
      if (currentValue.danger) {
        previousValue.dangerItems.push(currentValue);
      } else {
        previousValue.defaultItems.push(currentValue);
      }

      return previousValue;
    },
    { dangerItems: [], defaultItems: [] } as SortedItems<T>,
  );

  return (
    <>
      <Menu.Label>Actions</Menu.Label>
      {defaultItems.map((item, index) => (
        <Menu.Item
          key={index}
          leftSection={item.icon}
          onClick={() => item.onClick(cell)}
        >
          {item.label}
        </Menu.Item>
      ))}
      {dangerItems.length > 0 ? (
        <>
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          {dangerItems.map((item, index) => (
            <Menu.Item
              key={index}
              leftSection={item.icon}
              onClick={() => item.onClick(cell)}
              color="red"
            >
              {item.label}
            </Menu.Item>
          ))}
        </>
      ) : null}
    </>
  );
};

export default ActionRow;
