"use client";
import cx from "clsx";
import React from "react";
import {
  Table as TableM,
  ScrollArea,
  Pagination,
  Text,
  rem,
} from "@mantine/core";
import Styles from "./Table.styles.module.css";
import { BaseCellData, TableProps } from "./@Table.types";
import useTableSort from "./hooks/useTableSort";
import useTableSearch from "./hooks/useTableSearch";
import useTableSelection from "./hooks/useTableSelection";
import TableTop from "./components/TableTop";
import TableHead from "./components/TableHead";
import TableBody from "./components/TableBody";
import useTablePagination from "./hooks/useTablePagination";

export default function Table<T extends BaseCellData>({
  data,
  filter,
  className,
  selection,
  onSelectionChange,
  actions,
  columns,
  searchable,
  rightSection,
  defaultSort,
  suggestionKeys,
  pageSize,
  defaultPage,
  noResultsText,
}: TableProps<T>) {
  const { setSearchValue, searchValue, searchedData, suggestions } =
    useTableSearch<T>({
      data,
      filter,
      searchable,
      suggestionKeys,
    });

  const { sort, onSort, sortedData, schemeSet } = useTableSort<T>({
    defaultSort,
    data: searchedData,
  });

  const { selectionSet, hasSelection, toggleAll, toggleRow } =
    useTableSelection<T>({
      selection,
      onSelectionChange,
      data: sortedData,
    });

  const {
    pageCount,
    currentPage,
    paginatedData,
    updatePage,
    prevPage,
    nextPage,
    resultsText,
  } = useTablePagination({
    data: sortedData,
    defaultPage,
    pageSize,
  });

  return (
    <div className={cx(Styles.container, className)}>
      <TableTop
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        suggestions={suggestions}
        rightSection={rightSection}
        searchable={searchable}
        resultCount={sortedData.length}
      />
      <ScrollArea className={Styles.tableContainer}>
        <TableM miw={800} verticalSpacing="sm" className={Styles.table}>
          <TableHead<T>
            data={sortedData}
            sort={sort}
            toggleAll={toggleAll}
            columns={columns}
            schemeSet={schemeSet}
            onSort={onSort}
            actions={actions}
            hasSelection={hasSelection}
            selection={selection}
          />
          <TableBody<T>
            data={paginatedData}
            columns={columns}
            hasSelection={hasSelection}
            selectionSet={selectionSet}
            toggleRow={toggleRow}
            actions={actions}
            noResultsText={noResultsText}
          />
        </TableM>
      </ScrollArea>
      {pageSize && paginatedData.length > 0 ? (
        <div className={Styles.pagination}>
          <Text mb="xs" mt="xl" size={rem(14)} color="gray">
            {resultsText}
          </Text>
          <Pagination
            total={pageCount}
            siblings={3}
            value={currentPage}
            onNextPage={nextPage}
            onPreviousPage={prevPage}
            onFirstPage={() => updatePage(1)}
            onLastPage={() => updatePage(pageCount)}
            onChange={updatePage}
          />
        </div>
      ) : null}
    </div>
  );
}