import { useMemo } from "react";
import { BaseCellData } from "../@Table.types";

interface Props<T extends BaseCellData> {
  selection?: string[];
  onSelectionChange?: (newSelection: string[]) => void;
  data: T[];
}

export default function useTableSelection<T extends BaseCellData>({
  onSelectionChange,
  selection,
  data,
}: Props<T>) {
  const hasSelection = Boolean(selection && onSelectionChange);

  const toggleRow = (id: string) => {
    if (!hasSelection) return;

    const newSelection = selectionSet.has(id)
      ? selection!.filter((s) => s !== id)
      : [...selection!, id];

    onSelectionChange!(newSelection);
  };

  const toggleAll = () => {
    if (!hasSelection) return;

    if (selection!.length === data.length) {
      onSelectionChange!([]);
      return;
    }

    if (selection?.length === 0) {
      onSelectionChange!(data.map((item) => item.id));
      return;
    }

    onSelectionChange!([]);
  };

  const selectionSet = useMemo(() => {
    return new Set(selection);
  }, [selection]);

  return {
    hasSelection,
    selectionSet,
    toggleAll,
    toggleRow,
  };
}
