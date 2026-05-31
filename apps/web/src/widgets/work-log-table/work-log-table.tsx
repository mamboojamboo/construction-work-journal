import { ArrowDownUp, MoreHorizontal, TableProperties } from "lucide-react";

import { Button } from "@/shared/ui/button";

const columns = [
  "Дата",
  "Вид работ",
  "Количество",
  "Ед.",
  "Исполнитель",
  "Комментарий",
  "Действия",
];

export function WorkLogTable() {
  return (
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
        <table className="w-full min-w-[920px] table-fixed border-collapse">
          <thead>
            <tr className="border-b bg-muted text-left text-xs font-medium uppercase text-muted-foreground">
              {columns.map((column) => (
                <th className="px-4 py-3" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-14 text-center" colSpan={columns.length}>
                <div className="mx-auto max-w-sm">
                  <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                    <MoreHorizontal className="size-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-medium">Записей пока нет</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Создайте первую запись или измените параметры фильтра.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
