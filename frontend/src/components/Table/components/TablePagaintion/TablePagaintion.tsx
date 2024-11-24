"use client";
import React from "react";
import { Text, Pagination, rem, Stack } from "@mantine/core";
import Styles from "./TablePagination.module.css";
import clsx from "clsx";
import PaginationNavigationButton from "./components/PaginationNavigationButton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

interface TablePaginationProps {
  pageCount: number;
  currentPage: number;
  resultsText: string;
  updatePage: (page: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  className?: string;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pageCount,
  currentPage,
  resultsText,
  updatePage,
  prevPage,
  nextPage,
  className,
}) => {
  return (
    <Stack
      className={clsx("af-table-pagination", Styles.pagination, className)}
      align="center"
    >
      <Text mb="xs" mt="xl" size={rem(14)} className={Styles.text}>
        {resultsText}
      </Text>
      <Pagination
        total={pageCount}
        siblings={0}
        value={currentPage}
        onNextPage={nextPage}
        onPreviousPage={prevPage}
        onFirstPage={() => updatePage(1)}
        onLastPage={() => updatePage(pageCount)}
        onChange={updatePage}
        getControlProps={(control) => ({ "data-type": control })}
        nextIcon={() => (
          <PaginationNavigationButton text="Next" RightIcon={IconArrowRight} />
        )}
        previousIcon={() => (
          <PaginationNavigationButton
            text="Previous"
            LeftIcon={IconArrowLeft}
          />
        )}
      />
    </Stack>
  );
};

export default TablePagination;
