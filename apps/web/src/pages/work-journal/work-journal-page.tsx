import {
  ArrowDownUp,
  CalendarDays,
  Filter,
  Plus,
  TableProperties,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const summaryItems = [
  { label: "Всего записей", value: "0", note: "Пока нет записей" },
  { label: "Видов работ", value: "8", note: "Доступно для выбора" },
  { label: "Последняя запись", value: "—", note: "Нет записей за период" },
  { label: "Общий объем", value: "0", note: "По текущей выборке" },
];

export function WorkJournalPage() {
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

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-muted-foreground">
                {item.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Filter className="size-4 text-primary" aria-hidden="true" />
          Фильтры
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-md border bg-background px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              Дата с
            </div>
            <p className="mt-2 text-sm font-medium">Не выбрана</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              Дата по
            </div>
            <p className="mt-2 text-sm font-medium">Не выбрана</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Вид работ</p>
            <p className="mt-2 text-sm font-medium">Все виды</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Исполнитель</p>
            <p className="mt-2 text-sm font-medium">Не задан</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TableProperties className="size-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-base font-semibold">Записи работ</h2>
              <p className="text-sm text-muted-foreground">
                Нет записей по текущим фильтрам.
              </p>
            </div>
          </div>
          <Button variant="outline" disabled>
            <ArrowDownUp aria-hidden="true" />
            Дата
          </Button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[120px_180px_120px_120px_1fr_96px] border-b bg-muted px-4 py-3 text-xs font-medium uppercase text-muted-foreground">
              <span>Дата</span>
              <span>Вид работ</span>
              <span>Количество</span>
              <span>Ед.</span>
              <span>Исполнитель</span>
              <span>Действия</span>
            </div>
            <div className="flex min-h-56 items-center justify-center px-4 py-12">
              <div className="text-center">
                <p className="font-medium">Записей пока нет</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Создайте первую запись или измените параметры фильтра.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
