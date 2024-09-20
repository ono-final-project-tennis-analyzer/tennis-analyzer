import { renderHook, act } from "@testing-library/react-hooks";
import useTablePagination from "../hooks/useTablePagination";

describe("useTablePagination hook", () => {
  test("initializes with default page and pageSize", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        data: new Array(50).fill({ id: 1 }), // Mock data with 50 items
        defaultPage: 1,
        pageSize: 10,
      }),
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedData.length).toBe(10);
    expect(result.current.resultsText).toBe("Showing 10 results out of 50");
  });

  test("changes page correctly with nextPage and prevPage", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        data: new Array(100).fill({ id: 1 }),
        defaultPage: 1,
        pageSize: 10,
      }),
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  test("handles pageSize change", () => {
    const { result, rerender } = renderHook(
      ({ pageSize }) =>
        useTablePagination({
          data: new Array(45).fill({ id: 1 }),
          defaultPage: 1,
          pageSize,
        }),
      {
        initialProps: { pageSize: 10 },
      },
    );

    act(() => {
      rerender({ pageSize: 15 });
    });

    expect(result.current.paginatedData.length).toBe(15);
    expect(result.current.resultsText).toBe("Showing 15 results out of 45");
  });

  test("adjusts to new data length", () => {
    const { result, rerender } = renderHook(
      ({ data }) =>
        useTablePagination({
          data,
          defaultPage: 3,
          pageSize: 10,
        }),
      {
        initialProps: { data: new Array(100).fill({ id: 1 }) },
      },
    );

    act(() => {
      rerender({ data: new Array(20).fill({ id: 1 }) });
    });

    expect(result.current.currentPage).toBe(2); // Should adjust to last valid page
  });

  test("does not exceed maximum page count when data decreases", () => {
    const { result, rerender } = renderHook(
      ({ data }) =>
        useTablePagination({
          data,
          defaultPage: 5,
          pageSize: 10,
        }),
      {
        initialProps: { data: new Array(50).fill({ id: 1 }) },
      },
    );

    act(() => {
      rerender({ data: new Array(30).fill({ id: 1 }) });
    });

    expect(result.current.currentPage).toBe(3); // Adjusted since page 5 is out of range
  });

  test("handles pageSize as 0", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        data: new Array(50).fill({ id: 1 }),
        pageSize: 0,
      }),
    );

    expect(result.current.paginatedData.length).toBe(0);
    expect(result.current.resultsText).toBe("");
  });

  describe("Boundary checks", () => {
    test("does not navigate below page 1", () => {
      const { result } = renderHook(() =>
        useTablePagination({
          data: new Array(10).fill({ id: 1 }),
          pageSize: 5,
          defaultPage: 1,
        }),
      );

      act(() => {
        result.current.prevPage();
      });

      expect(result.current.currentPage).toBe(1);
    });

    test("does not navigate beyond the last page", () => {
      const { result } = renderHook(() =>
        useTablePagination({
          data: new Array(10).fill({ id: 1 }),
          pageSize: 5,
          defaultPage: 1,
        }),
      );

      act(() => {
        result.current.nextPage();
        result.current.nextPage(); // Try to move to page 3
      });

      expect(result.current.currentPage).toBe(2); // Last valid page
    });
  });

  describe("Edge case handling", () => {
    test("initializes without defaultPage or pageSize", () => {
      const { result } = renderHook(() =>
        useTablePagination({
          data: new Array(50).fill({ id: 1 }),
        }),
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.paginatedData.length).toBe(0); // As pageSize is undefined, expecting no data
    });

    test("handles defaultPage out of range", () => {
      const { result } = renderHook(() =>
        useTablePagination({
          data: new Array(10).fill({ id: 1 }),
          defaultPage: 5,
          pageSize: 5,
        }),
      );

      expect(result.current.currentPage).toBe(2); // Should adjust to last valid page
    });

    test("maintains currentPage when increasing pageSize", () => {
      const { result, rerender } = renderHook(
        ({ pageSize }) =>
          useTablePagination({
            data: new Array(30).fill({ id: 1 }),
            pageSize,
            defaultPage: 1,
          }),
        {
          initialProps: { pageSize: 5 },
        },
      );

      act(() => {
        rerender({ pageSize: 20 });
      });

      expect(result.current.currentPage).toBe(1); // Page should not change
      expect(result.current.paginatedData.length).toBe(20);
    });

    test("handles empty data array", () => {
      const { result } = renderHook(() =>
        useTablePagination({
          data: [],
          pageSize: 10,
        }),
      );

      expect(result.current.paginatedData.length).toBe(0);
      expect(result.current.resultsText).toBe("Showing 0 results out of 0");
    });
  });
});
