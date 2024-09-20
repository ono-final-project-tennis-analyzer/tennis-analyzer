import { renderHook, act } from "@testing-library/react-hooks";
import useTableSort from "@/components/Table/hooks/useTableSort";
import { TableSort } from "@/components/Table";

describe("useTableSort Hook", () => {
  describe("Initialization", () => {
    test("initializes with default sorting", () => {
      const defaultSort: TableSort<{ id: string; name: string }> = {
        sortBy: "name",
        direction: "ascending",
      };
      const { result } = renderHook(() =>
        useTableSort({
          data: [{ id: "1", name: "John" }],
          defaultSort,
        }),
      );

      expect(result.current.sort).toEqual(defaultSort);
    });

    test("initializes with no sorting if no default sort specified", () => {
      const { result } = renderHook(() =>
        useTableSort({
          data: [{ id: "1", name: "John" }],
        }),
      );

      expect(result.current.sort).toEqual({ sortBy: "", direction: "" });
    });
  });

  describe("Sorting Functionality", () => {
    test.each([
      {
        data: [
          { id: "2", name: "Anna" },
          { id: "1", name: "John" },
        ],
        key: "name",
        firstSorted: "Anna",
      },
      {
        data: [
          { id: "1", name: "John" },
          { id: "3", name: "Anna" },
        ],
        key: "id",
        firstSorted: "1",
      },
    ])("sorts correctly on $key", ({ data, key, firstSorted }) => {
      const { result } = renderHook(() => useTableSort({ data }));

      act(() => {
        result.current.onSort(key as keyof { id: string; name: string });
      });

      expect(
        result.current.sortedData[0][key as keyof { id: string; name: string }],
      ).toBe(firstSorted);
    });

    test("toggles sort direction on subsequent clicks", () => {
      const { result } = renderHook(() =>
        useTableSort({
          data: [
            { id: "1", name: "John" },
            { id: "2", name: "Anna" },
          ],
          defaultSort: { sortBy: "name", direction: "ascending" },
        }),
      );

      act(() => {
        result.current.onSort("name");
      });

      expect(result.current.sort.direction).toBe("descending");
      expect(result.current.sortedData[0].name).toBe("John");
    });
  });

  describe("Miscellaneous", () => {
    test("schemeSet reflects all keys from data items", () => {
      const { result } = renderHook(() =>
        useTableSort({
          data: [{ id: "1", name: "John", age: 30 }],
        }),
      );

      expect(result.current.schemeSet).toEqual(new Set(["id", "name", "age"]));
    });

    test("handles empty data set", () => {
      const { result } = renderHook(() =>
        useTableSort({
          data: [],
        }),
      );

      expect(result.current.sortedData).toEqual([]);
      expect(result.current.schemeSet).toEqual(new Set());
    });
  });
});
