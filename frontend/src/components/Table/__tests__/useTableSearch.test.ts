import { renderHook, act } from "@testing-library/react-hooks";
import useTableSearch from "@/components/Table/hooks/useTableSearch";

describe("useTableSearch Hook", () => {
  describe("Search Functionality", () => {
    test("should return all data when searchable is false", () => {
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "1" }, { id: "2" }],
          searchable: false,
        }),
      );

      expect(result.current.searchedData).toEqual([{ id: "1" }, { id: "2" }]);
    });

    test("should filter data based on search term when searchable is true", () => {
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "apple" }, { id: "banana" }],
          searchable: true,
        }),
      );

      act(() => {
        result.current.setSearchValue("ban");
      });

      expect(result.current.searchedData).toEqual([{ id: "banana" }]);
    });

    test.each(["  apple  ", "apple", "  apple"])(
      'should trim search input "%s" and search correctly',
      (searchValue) => {
        const { result } = renderHook(() =>
          useTableSearch({
            data: [{ id: "apple" }, { id: "banana" }],
            searchable: true,
          }),
        );

        act(() => {
          result.current.setSearchValue(searchValue);
        });

        expect(result.current.searchedData).toEqual([{ id: "apple" }]);
      },
    );
  });

  describe("Filter Functionality", () => {
    test("should return no items when custom filter returns false for all", () => {
      const customFilter = vi.fn().mockReturnValue(false);
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "apple" }, { id: "banana" }],
          searchable: true,
          filter: customFilter,
        }),
      );

      act(() => {
        result.current.setSearchValue("a");
      });

      expect(result.current.searchedData).toEqual([]);
      expect(customFilter).toHaveBeenCalledTimes(4); // Called for each item
    });

    test("should return all items when custom filter returns true for all", () => {
      const customFilter = vi.fn().mockReturnValue(true);
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "apple" }, { id: "banana" }],
          searchable: true,
          filter: customFilter,
        }),
      );

      act(() => {
        result.current.setSearchValue("a");
      });

      expect(result.current.searchedData).toEqual([
        { id: "apple" },
        { id: "banana" },
      ]);
      expect(customFilter).toHaveBeenCalledTimes(4); // Called for each item
    });
  });

  describe("Suggestions Generation", () => {
    test("should generate suggestions based on suggestionKeys", () => {
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "apple" }, { id: "apple" }, { id: "banana" }],
          searchable: true,
          suggestionKeys: ["id"],
        }),
      );

      expect(result.current.suggestions).toEqual(["apple", "banana"]);
    });

    test("should handle no suggestionKeys provided", () => {
      const { result } = renderHook(() =>
        useTableSearch({
          data: [{ id: "apple" }, { id: "banana" }],
          searchable: true,
        }),
      );

      expect(result.current.suggestions).toEqual([]);
    });
  });
});
