import { BaseCellData } from "@/components/Table";
import { useEffect, useMemo, useState } from "react";

interface Props<T extends BaseCellData> {
  defaultPage?: number;
  pageSize?: number;
  data: T[];
}

export default function useTablePagination<T extends BaseCellData>({
  defaultPage = 1,
  pageSize,
  data,
}: Props<T>) {
  const [page, setPage] = useState(defaultPage);

  const paginatedData = useMemo(() => {
    if (!pageSize || pageSize <= 0)
      return { data, pageCount: 0, resultsText: "" };

    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);
    const pageCount = Math.ceil(data.length / pageSize);
    const resultsText = `Showing ${Math.min(paginatedData.length, pageSize)} results out of ${data.length}`;

    return {
      data: paginatedData,
      pageCount,
      resultsText,
    };
  }, [data, page, pageSize]);

  useEffect(() => {
    if (page > paginatedData.pageCount && paginatedData.pageCount > 0) {
      setPage(paginatedData.pageCount);
    }
  }, [page, paginatedData.pageCount]);

  const nextPage = () => {
    setPage((prev) => Math.min(prev + 1, paginatedData.pageCount));
  };

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const updatePage = (newPage: number) => {
    // Clamp newPage between 1 and pageCount
    setPage(Math.max(1, Math.min(newPage, paginatedData.pageCount)));
  };

  return {
    currentPage: page,
    prevPage,
    nextPage,
    updatePage,
    paginatedData: paginatedData.data,
    pageCount: paginatedData.pageCount,
    resultsText: paginatedData.resultsText,
  };
}
