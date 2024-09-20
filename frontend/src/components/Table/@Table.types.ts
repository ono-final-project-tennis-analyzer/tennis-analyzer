import React from "react";

export interface TableProps<T extends BaseCellData> {
  className?: string;
  selection?: string[];
  onSelectionChange?: (newSelection: string[]) => void;
  filter?: (term: string, cell: TableCell<T>) => boolean;
  actions?: (cell: TableCell<T>) => React.ReactNode;
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  rightSection?: React.ReactNode;
  defaultSort?: TableSort<T>;
  suggestionKeys?: (keyof T)[];
  pageSize?: number;
  defaultPage?: number;
  noResultsText?: string;
}

export interface TableCell<T extends BaseCellData> {
  index: number;
  data: T;
}

export interface TableColumn<T extends BaseCellData> {
  header: React.ReactNode;
  accessor?: string | keyof T;
  renderRow: keyof T | ((cell: TableCell<T>) => React.ReactNode);
  onClick?: (cell: TableCell<T>) => void;
  className?: string;
  maxWidth?: string | number;
  minWidth?: string | number;
  width?: string | number;
}

export interface BaseCellData {
  id: string;
}

export interface TableSort<T extends BaseCellData> {
  sortBy: "" | keyof T;
  direction: "" | "ascending" | "descending";
}
