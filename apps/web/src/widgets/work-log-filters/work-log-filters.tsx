import { CalendarDays, Filter, RotateCcw } from "lucide-react";

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

export function WorkLogFilters() {
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" aria-hidden="true" />
          Фильтры
        </div>
        <Button variant="outline" disabled>
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
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
              disabled
              id={field.id}
              type={field.type}
            />
          </label>
        ))}

        <label className="space-y-2" htmlFor="workTypeId">
          <span className="text-xs font-medium text-muted-foreground">
            Вид работ
          </span>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
            disabled
            id="workTypeId"
          >
            <option>Все виды работ</option>
          </select>
        </label>

        <label className="space-y-2" htmlFor="performer">
          <span className="text-xs font-medium text-muted-foreground">
            Исполнитель
          </span>
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
            disabled
            id="performer"
            placeholder="ФИО исполнителя"
            type="text"
          />
        </label>
      </div>
    </section>
  );
}
