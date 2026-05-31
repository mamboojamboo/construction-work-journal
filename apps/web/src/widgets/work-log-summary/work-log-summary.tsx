import { Activity, CalendarClock, Layers3, Sigma } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const summaryItems = [
  {
    label: "Всего записей",
    value: "0",
    note: "Пока нет записей",
    icon: Activity,
  },
  {
    label: "Видов работ",
    value: "8",
    note: "Доступно для выбора",
    icon: Layers3,
  },
  {
    label: "Последняя запись",
    value: "—",
    note: "Нет записей за период",
    icon: CalendarClock,
  },
  {
    label: "Общий объем",
    value: "0",
    note: "По текущей выборке",
    icon: Sigma,
  },
];

export function WorkLogSummary() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
            <div className="space-y-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
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
