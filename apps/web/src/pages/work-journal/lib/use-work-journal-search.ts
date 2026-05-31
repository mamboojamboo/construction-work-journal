import { useCallback, useEffect, useMemo, useState } from "react";

import {
  GetWorkLogsSortBy,
  GetWorkLogsSortOrder,
  type GetWorkLogsParams,
} from "@/shared/api/generated/work-journal-api";

export type WorkJournalFilters = {
  dateFrom?: string;
  dateTo?: string;
  workTypeId?: string;
  performer?: string;
};

export type WorkJournalSearchState = WorkJournalFilters & {
  sortOrder: GetWorkLogsSortOrder;
};

const defaultSearchState: WorkJournalSearchState = {
  sortOrder: GetWorkLogsSortOrder.desc,
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function useWorkJournalSearch() {
  const [searchState, setSearchState] = useState(readSearchState);

  useEffect(() => {
    const handlePopState = () => {
      setSearchState(readSearchState());
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setFilters = useCallback((filters: Partial<WorkJournalFilters>) => {
    setSearchState((current) => {
      const next = {
        ...current,
        ...normalizeFilters(filters),
      };

      writeSearchState(next);

      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    writeSearchState(defaultSearchState);
    setSearchState(defaultSearchState);
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSearchState((current) => {
      const next = {
        ...current,
        sortOrder:
          current.sortOrder === GetWorkLogsSortOrder.desc
            ? GetWorkLogsSortOrder.asc
            : GetWorkLogsSortOrder.desc,
      };

      writeSearchState(next);

      return next;
    });
  }, []);

  const queryParams = useMemo<GetWorkLogsParams>(
    () => ({
      dateFrom: searchState.dateFrom,
      dateTo: searchState.dateTo,
      workTypeId: searchState.workTypeId,
      performer: searchState.performer,
      sortBy: GetWorkLogsSortBy.performedAt,
      sortOrder: searchState.sortOrder,
    }),
    [searchState],
  );

  const hasActiveFilters = Boolean(
    searchState.dateFrom ||
      searchState.dateTo ||
      searchState.workTypeId ||
      searchState.performer ||
      searchState.sortOrder !== defaultSearchState.sortOrder,
  );

  return {
    filters: searchState,
    hasActiveFilters,
    queryParams,
    resetFilters,
    setFilters,
    toggleSortOrder,
  };
}

function readSearchState(): WorkJournalSearchState {
  const params = new URLSearchParams(window.location.search);

  return {
    dateFrom: normalizeDate(params.get("dateFrom")),
    dateTo: normalizeDate(params.get("dateTo")),
    workTypeId: normalizeOptionalValue(params.get("workTypeId")),
    performer: normalizeOptionalValue(params.get("performer")),
    sortOrder: normalizeSortOrder(params.get("sortOrder")),
  };
}

function writeSearchState(state: WorkJournalSearchState) {
  const params = new URLSearchParams();

  setOptionalParam(params, "dateFrom", state.dateFrom);
  setOptionalParam(params, "dateTo", state.dateTo);
  setOptionalParam(params, "workTypeId", state.workTypeId);
  setOptionalParam(params, "performer", state.performer);

  if (state.sortOrder !== defaultSearchState.sortOrder) {
    params.set("sortBy", GetWorkLogsSortBy.performedAt);
    params.set("sortOrder", state.sortOrder);
  }

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;

  window.history.pushState(null, "", nextUrl);
}

function normalizeFilters(
  filters: Partial<WorkJournalFilters>,
): Partial<WorkJournalFilters> {
  return {
    dateFrom:
      filters.dateFrom === undefined
        ? undefined
        : normalizeDate(filters.dateFrom),
    dateTo:
      filters.dateTo === undefined ? undefined : normalizeDate(filters.dateTo),
    workTypeId:
      filters.workTypeId === undefined
        ? undefined
        : normalizeOptionalValue(filters.workTypeId),
    performer:
      filters.performer === undefined
        ? undefined
        : normalizeOptionalValue(filters.performer),
  };
}

function normalizeDate(value: string | null | undefined) {
  if (!value || !datePattern.test(value)) {
    return undefined;
  }

  return value;
}

function normalizeSortOrder(value: string | null) {
  return value === GetWorkLogsSortOrder.asc
    ? GetWorkLogsSortOrder.asc
    : GetWorkLogsSortOrder.desc;
}

function normalizeOptionalValue(value: string | null | undefined) {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

function setOptionalParam(
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  if (value) {
    params.set(key, value);
  }
}
