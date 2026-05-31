import { Plus } from "lucide-react";

import {
  GetWorkLogsSortBy,
  GetWorkLogsSortOrder,
  useGetWorkLogs,
} from "@/shared/api/generated/work-journal-api";
import { Button } from "@/shared/ui/button";
import { WorkLogFilters } from "@/widgets/work-log-filters/work-log-filters";
import { WorkLogSummary } from "@/widgets/work-log-summary/work-log-summary";
import { WorkLogTable } from "@/widgets/work-log-table/work-log-table";

export function WorkJournalPage() {
  const workLogsQuery = useGetWorkLogs({
    sortBy: GetWorkLogsSortBy.performedAt,
    sortOrder: GetWorkLogsSortOrder.desc,
  });
  const workLogs = workLogsQuery.data?.items ?? [];

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
        <Button disabled title="Добавление записи">
          <Plus aria-hidden="true" />
          Добавить запись
        </Button>
      </section>

      <WorkLogSummary />
      <WorkLogFilters />
      <WorkLogTable
        isError={workLogsQuery.isError}
        isLoading={workLogsQuery.isLoading}
        onRetry={() => void workLogsQuery.refetch()}
        records={workLogs}
        total={workLogsQuery.data?.total ?? 0}
      />
    </div>
  );
}
