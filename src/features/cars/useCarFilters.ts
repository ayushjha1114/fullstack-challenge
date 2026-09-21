import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { CarFilters } from "./api";
import type { SortKey } from "./sort";

export function useCarFilters() {
  const [model, setModel] = useState("");
  const [sort, setSort] = useState<SortKey>("year_desc");

  const debouncedModel = useDebounce(model, 300);

  const filters = useMemo(() => {
    const vars: CarFilters = {};
    const trimmed = debouncedModel.trim();
    if (trimmed) vars.model = trimmed;
    return vars;
  }, [debouncedModel]);

  return { model, setModel, sort, setSort, filters };
}