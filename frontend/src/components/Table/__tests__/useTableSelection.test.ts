import { renderHook, act } from "@testing-library/react-hooks";
import useTableSelection from "@/components/Table/hooks/useTableSelection";

describe("useTableSelection Hook", () => {
  describe("Initialization", () => {
    test("should initialize correctly with selection capabilities", () => {
      const { result } = renderHook(() =>
        useTableSelection({
          selection: ["1", "2"],
          onSelectionChange: vi.fn(),
          data: [{ id: "1" }, { id: "2" }, { id: "3" }],
        }),
      );

      expect(result.current.hasSelection).toBe(true);
    });

    test("should initialize without selection capabilities if props missing", () => {
      const { result } = renderHook(() =>
        useTableSelection({
          data: [{ id: "1" }, { id: "2" }, { id: "3" }],
        }),
      );

      expect(result.current.hasSelection).toBe(false);
    });
  });

  describe("Toggle Individual Row", () => {
    test("should add id to selection if not already selected", () => {
      const onSelectionChange = vi.fn();
      const { result } = renderHook(() =>
        useTableSelection({
          selection: ["1"],
          onSelectionChange,
          data: [{ id: "1" }, { id: "2" }],
        }),
      );

      act(() => {
        result.current.toggleRow("2");
      });

      expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"]);
    });

    test("should remove id from selection if already selected", () => {
      const onSelectionChange = vi.fn();
      const { result } = renderHook(() =>
        useTableSelection({
          selection: ["1", "2"],
          onSelectionChange,
          data: [{ id: "1" }, { id: "2" }],
        }),
      );

      act(() => {
        result.current.toggleRow("2");
      });

      expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
    });

    test("should do nothing if hasSelection is false", () => {
      const onSelectionChange = vi.fn();
      const { result } = renderHook(() =>
        useTableSelection({
          data: [{ id: "1" }, { id: "2" }],
        }),
      );

      act(() => {
        result.current.toggleRow("1");
      });

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe("Toggle All Rows", () => {
    test("should select all when none are selected", () => {
      const onSelectionChange = vi.fn();
      const { result } = renderHook(() =>
        useTableSelection({
          selection: [],
          onSelectionChange,
          data: [{ id: "1" }, { id: "2" }, { id: "3" }],
        }),
      );

      act(() => {
        result.current.toggleAll();
      });

      expect(onSelectionChange).toHaveBeenCalledWith(["1", "2", "3"]);
    });

    test("should deselect all when all are selected", () => {
      const onSelectionChange = vi.fn();
      const { result } = renderHook(() =>
        useTableSelection({
          selection: ["1", "2", "3"],
          onSelectionChange,
          data: [{ id: "1" }, { id: "2" }, { id: "3" }],
        }),
      );

      act(() => {
        result.current.toggleAll();
      });

      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });
});
