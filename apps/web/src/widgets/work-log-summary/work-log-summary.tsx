import { Activity, CalendarClock, Layers3, Sigma } from "lucide-react";
import { format, parseISO } from "date-fns";

import type {
  WorkLogResponseDto,
  WorkTypeResponseDto,
} from "@/shared/api/generated/work-journal-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type WorkLogSummaryProps = {
  records: WorkLogResponseDto[];
  total: number;
  workTypes: WorkTypeResponseDto[];
  isInvalidDateRange: boolean;
  isWorkLogsLoading: boolean;
  isWorkLogsError: boolean;
  isWorkTypesLoading: boolean;
  isWorkTypesError: boolean;
};

export function WorkLogSummary({
  records,
  total,
  workTypes,
  isInvalidDateRange,
  isWorkLogsLoading,
  isWorkLogsError,
  isWorkTypesLoading,
  isWorkTypesError,
}: WorkLogSummaryProps) {
  const totalQuantity = records.reduce(
    (sum, record) => sum + record.quantity,
    0,
  );
  const latestRecord = getLatestRecord(records);
  const summaryItems = [
    {
      label: "Всего записей",
      value: formatInteger(total),
      isLoading: isWorkLogsLoading,
      note: getRecordsNote(
        total,
        isWorkLogsLoading,
        isWorkLogsError,
        isInvalidDateRange,
      ),
      icon: Activity,
    },
    {
      label: "Видов работ",
      value: formatInteger(workTypes.length),
      isLoading: isWorkTypesLoading,
      note: isWorkTypesError
        ? "Справочник может быть недоступен"
        : "Доступно для выбора",
      icon: Layers3,
    },
    {
      label: "Последняя запись",
      value: formatLatestDate(latestRecord),
      isLoading: isWorkLogsLoading,
      note: latestRecord
        ? latestRecord.workType.name
        : isInvalidDateRange
          ? "Исправьте диапазон дат"
          : "Нет записей за период",
      icon: CalendarClock,
    },
    {
      label: "Общий объем",
      value: formatQuantity(totalQuantity),
      isLoading: isWorkLogsLoading,
      note: "Сумма по текущей выборке",
      icon: Sigma,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
            <div className="space-y-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl tracking-normal">
                {item.isLoading ? (
                  <span className="block h-8 w-20 animate-pulse rounded-sm bg-muted" />
                ) : (
                  item.value
                )}
              </CardTitle>
            </div>
            <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
              <item.icon className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-5 text-muted-foreground">
              {item.note}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

function getRecordsNote(
  total: number,
  isLoading: boolean,
  isError: boolean,
  isInvalidDateRange: boolean,
) {
  if (isLoading) {
    return "Обновляем текущую выборку";
  }

  if (isError) {
    return "Не удалось загрузить журнал";
  }

  if (isInvalidDateRange) {
    return "Дата начала позже даты окончания";
  }

  return total > 0 ? "По текущим фильтрам" : "Пока нет записей";
}

function getLatestRecord(records: WorkLogResponseDto[]) {
  return records.reduce<WorkLogResponseDto | null>((latest, record) => {
    if (!latest) {
      return record;
    }

    return record.performedAt > latest.performedAt ? record : latest;
  }, null);
}

function formatLatestDate(record: WorkLogResponseDto | null) {
  if (!record) {
    return "—";
  }

  try {
    return format(parseISO(record.performedAt), "dd.MM.yyyy");
  } catch {
    return record.performedAt;
  }
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value);
}
