import { useCallback, useState } from "react";

import { CreateWorkLogDialog } from "@/features/create-work-log/create-work-log-dialog";
import { DeleteWorkLogDialog } from "@/features/delete-work-log/delete-work-log-dialog";
import { EditWorkLogDialog } from "@/features/edit-work-log/edit-work-log-dialog";
import {
  useGetWorkLogs,
  useGetWorkTypes,
  type WorkLogResponseDto,
} from "@/shared/api/generated/work-journal-api";
import { WorkLogFilters } from "@/widgets/work-log-filters/work-log-filters";
import { WorkLogSummary } from "@/widgets/work-log-summary/work-log-summary";
import { WorkLogTable } from "@/widgets/work-log-table/work-log-table";
import { useWorkJournalSearch } from "./lib/use-work-journal-search";

export function WorkJournalPage() {
  const [editedWorkLog, setEditedWorkLog] = useState<WorkLogResponseDto | null>(
    null,
  );
  const [deletedWorkLog, setDeletedWorkLog] =
    useState<WorkLogResponseDto | null>(null);
  const {
    filters,
    hasActiveFilters,
    queryParams,
    resetFilters,
    setFilters,
    toggleSortOrder,
  } = useWorkJournalSearch();
  const isInvalidDateRange = Boolean(
    filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo,
  );
  const workLogsQuery = useGetWorkLogs(queryParams, {
    query: {
      enabled: !isInvalidDateRange,
    },
  });
  const workTypesQuery = useGetWorkTypes();
  const workLogs = isInvalidDateRange ? [] : (workLogsQuery.data?.items ?? []);
  const total = isInvalidDateRange ? 0 : (workLogsQuery.data?.total ?? 0);

  const handleEdit = useCallback((record: WorkLogResponseDto) => {
    setEditedWorkLog(record);
  }, []);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEditedWorkLog(null);
    }
  }, []);

  const handleDelete = useCallback((record: WorkLogResponseDto) => {
    setDeletedWorkLog(record);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDeletedWorkLog(null);
    }
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Журнал участка</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
            Журнал работ
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ежедневная фиксация выполненных строительных работ: дата, тип работ,
            объем, единица измерения, исполнитель и комментарий прораба.
          </p>
        </div>
        <CreateWorkLogDialog
          isWorkTypesError={workTypesQuery.isError}
          isWorkTypesLoading={workTypesQuery.isLoading}
          workTypes={workTypesQuery.data ?? []}
        />
      </section>

      <WorkLogSummary
        isInvalidDateRange={isInvalidDateRange}
        isWorkLogsError={workLogsQuery.isError}
        isWorkLogsLoading={workLogsQuery.isLoading}
        isWorkTypesError={workTypesQuery.isError}
        isWorkTypesLoading={workTypesQuery.isLoading}
        records={workLogs}
        total={total}
        workTypes={workTypesQuery.data ?? []}
      />
      <WorkLogFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        isInvalidDateRange={isInvalidDateRange}
        isWorkTypesError={workTypesQuery.isError}
        isWorkTypesLoading={workTypesQuery.isLoading}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        workTypes={workTypesQuery.data ?? []}
      />
      <WorkLogTable
        hasActiveFilters={hasActiveFilters}
        isError={workLogsQuery.isError}
        isInvalidDateRange={isInvalidDateRange}
        isLoading={workLogsQuery.isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onRetry={() => void workLogsQuery.refetch()}
        onToggleSortOrder={toggleSortOrder}
        records={workLogs}
        sortOrder={filters.sortOrder}
        total={total}
      />
      <EditWorkLogDialog
        isWorkTypesError={workTypesQuery.isError}
        isWorkTypesLoading={workTypesQuery.isLoading}
        onOpenChange={handleEditOpenChange}
        open={Boolean(editedWorkLog)}
        record={editedWorkLog}
        workTypes={workTypesQuery.data ?? []}
      />
      <DeleteWorkLogDialog
        onOpenChange={handleDeleteOpenChange}
        open={Boolean(deletedWorkLog)}
        record={deletedWorkLog}
      />
    </div>
  );
}
