/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Table from "../Table";
import { Group, Pill, rem } from "@mantine/core";
import clsx from "clsx";
import Styles from "./Table.styles.module.css";
import {
  BaseCellData,
  TableCell,
  TableColumn,
  RowActionItem,
} from "../@Table.types";
import {
  IconCopy,
  IconEdit,
  IconEye,
  IconToggleLeftFilled,
  IconToggleRightFilled,
} from "@tabler/icons-react";
import Button from "../../Button";
import RowActions from "../components/RowActions";

interface ProgramRow extends BaseCellData {
  id: string;
  name: string;
  numberOfAffiliates: number;
  totalSales: number;
  commissionsPaid: number;
  status: string;
}

const data: ProgramRow[] = Array(200)
  .fill(0)
  .map((_, index) => ({
    id: String(index + 1),
    name: `Program ${index + 1}`,
    numberOfAffiliates: (index + 1) * 2000,
    totalSales: (index + 1) * 1241512,
    commissionsPaid: (index + 1) * 884823,
    status: index % 3 ? "Active" : "Inactive",
  }));

const columns: TableColumn<ProgramRow>[] = [
  {
    header: "Name",
    renderRow: (cell) => cell.data.name,
    accessor: "name",
    minWidth: 120,
  },
  {
    header: "Number of affiliates",
    renderRow: (cell) => cell.data.numberOfAffiliates,
    accessor: "numberOfAffiliates",
    minWidth: 200,
  },
  {
    header: "Total Sales",
    renderRow: (cell) => `$${cell.data.totalSales.toLocaleString()}`,
    accessor: "totalSales",
    minWidth: 140,
  },
  {
    header: "Commissions paid",
    renderRow: (cell) => `$${cell.data.commissionsPaid.toLocaleString()}`,
    accessor: "commissionsPaid",
    minWidth: 180,
  },
  {
    header: "Status",
    renderRow: (cell) => (
      <Pill
        className={clsx(
          Styles.pill,
          { [Styles.active]: cell.data.status === "Active" },
          { [Styles.inactive]: cell.data.status === "Inactive" },
        )}
      >
        {cell.data.status}
      </Pill>
    ),
    accessor: "status",
    minWidth: 120,
  },
];

const createActionItems = (
  cell: TableCell<ProgramRow>,
): RowActionItem<ProgramRow>[] => [
  {
    label: "View",
    icon: <IconEye style={{ width: rem(14), height: rem(14) }} />,
    onClick: (cell) => console.log("Viewing", cell.data),
  },
  {
    label: "Edit",
    icon: <IconEdit style={{ width: rem(14), height: rem(14) }} />,
    onClick: (cell) => console.log("Editing", cell.data),
  },
  {
    label: cell.data.status !== "Active" ? "Activate" : "Deactivate",
    icon:
      cell.data.status !== "Active" ? (
        <IconToggleRightFilled style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconToggleLeftFilled style={{ width: rem(14), height: rem(14) }} />
      ),
    onClick: (cell) =>
      console.log(
        cell.data.status !== "Active" ? "Activating" : "Deactivating",
        cell.data,
      ),
  },
  {
    label: "Clone",
    icon: <IconCopy style={{ width: rem(14), height: rem(14) }} />,
    onClick: (cell) => console.log("Cloning", cell.data),
  },
];

const actions = (cell: TableCell<ProgramRow>) => (
  <RowActions cell={cell} items={createActionItems(cell)} />
);

export default {
  title: "Tables/Table",
  component: Table,
} as Meta<typeof Table>;

const Template: StoryFn<typeof Table> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
  data,
  // @ts-ignore
  columns,
  pageSize: 10,
  searchable: true,
  noResultsText: "No matching programs found.",
  // @ts-ignore
  actions,
  rightSection: (
    <Group>
      <Button>New Program</Button>
    </Group>
  ),
};
