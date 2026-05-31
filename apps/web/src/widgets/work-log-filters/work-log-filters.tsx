import { CalendarDays, Filter, RotateCcw } from "lucide-react";

import type { WorkJournalFilters } from "@/pages/work-journal/lib/use-work-journal-search";
import type { WorkTypeResponseDto } from "@/shared/api/generated/work-journal-api";
import { Button } from "@/shared/ui/button";

const filterFields = [
  {
    id: "dateFrom",
    label: "Дата с",
    type: "date",
    icon: CalendarDays,
  },
  {
    id: "dateTo",
    label: "Дата по",
    type: "date",
    icon: CalendarDays,
  },
];

type WorkLogFiltersProps = {
  filters: WorkJournalFilters;
  workTypes: WorkTypeResponseDto[];
  isWorkTypesLoading: boolean;
  isWorkTypesError: boolean;
  hasActiveFilters: boolean;
  onFiltersChange: (filters: Partial<WorkJournalFilters>) => void;
  onReset: () => void;
};

export function WorkLogFilters({
  filters,
  workTypes,
  isWorkTypesLoading,
  isWorkTypesError,
  hasActiveFilters,
  onFiltersChange,
  onReset,
}: WorkLogFiltersProps) {
  const workTypePlaceholder = isWorkTypesError
    ? "Ошибка загрузки"
    : isWorkTypesLoading
      ? "Загрузка видов работ"
      : "Все виды работ";

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" aria-hidden="true" />
          Фильтры
        </div>
        <Button
          disabled={!hasActiveFilters}
          onClick={onReset}
          type="button"
          variant="outline"
        >
          <RotateCcw aria-hidden="true" />
          Сбросить
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filterFields.map((field) => (
          <label className="space-y-2" htmlFor={field.id} key={field.id}>
            <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <field.icon className="size-4" aria-hidden="true" />
              {field.label}
            </span>
            <input
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              id={field.id}
              onInput={(event) =>
                onFiltersChange({
                  [field.id]:
                    event.currentTarget.value || undefined,
                })
              }
              type={field.type}
              value={filters[field.id as keyof WorkJournalFilters] ?? ""}
            />
          </label>
        ))}

        <label className="space-y-2" htmlFor="workTypeId">
          <span className="text-xs font-medium text-muted-foreground">
            Вид работ
          </span>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isWorkTypesLoading || isWorkTypesError}
            id="workTypeId"
            onChange={(event) =>
              onFiltersChange({
                workTypeId: event.target.value || undefined,
              })
            }
            value={filters.workTypeId ?? ""}
          >
            <option value="">{workTypePlaceholder}</option>
            {workTypes.map((workType) => (
              <option key={workType.id} value={workType.id}>
                {workType.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2" htmlFor="performer">
          <span className="text-xs font-medium text-muted-foreground">
            Исполнитель
          </span>
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="performer"
            onChange={(event) =>
              onFiltersChange({
                performer: event.target.value || undefined,
              })
            }
            placeholder="ФИО исполнителя"
            type="text"
            value={filters.performer ?? ""}
          />
        </label>
      </div>
    </section>
  );
}
