import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import {
  AlertTriangle,
  ArrowDownUp,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  TableProperties,
  Trash2,
} from "lucide-react";

import type { WorkLogResponseDto } from "@/shared/api/generated/work-journal-api";
import { Button } from "@/shared/ui/button";

type WorkLogTableProps = {
  records: WorkLogResponseDto[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

const columns: ColumnDef<WorkLogResponseDto>[] = [
  {
    accessorKey: "performedAt",
    header: "Дата",
    cell: ({ row }) => formatDate(row.original.performedAt),
  },
  {
    accessorFn: (row) => row.workType.name,
    id: "workType",
    header: "Вид работ",
    cell: ({ row }) => row.original.workType.name,
  },
  {
    accessorKey: "quantity",
    header: "Количество",
    cell: ({ row }) => formatQuantity(row.original.quantity),
  },
  {
    accessorFn: (row) => row.workType.unit,
    id: "unit",
    header: "Ед.",
    cell: ({ row }) => row.original.workType.unit,
  },
  {
    accessorKey: "performer",
    header: "Исполнитель",
  },
  {
    accessorKey: "comment",
    header: "Комментарий",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-sm text-muted-foreground">
        {row.original.comment || "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Действия",
    cell: () => (
      <div className="flex items-center gap-1">
        <Button disabled size="icon" title="Редактировать" variant="ghost">
          <Pencil aria-hidden="true" />
        </Button>
        <Button disabled size="icon" title="Удалить" variant="ghost">
          <Trash2 aria-hidden="true" />
        </Button>
      </div>
    ),
  },
];

export function WorkLogTable({
  records,
  total,
  isLoading,
  isError,
  onRetry,
}: WorkLogTableProps) {
  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const colSpan = table.getAllColumns().length;
  const subtitle = isLoading
    ? "Загружаем записи журнала."
    : `${formatQuantity(total)} записей в текущей выборке.`;

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TableProperties className="size-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold">Записи работ</h2>
            <p className="text-sm text-muted-foreground">
              {isError ? "Не удалось загрузить записи." : subtitle}
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="border-b bg-muted text-left text-xs font-medium uppercase text-muted-foreground"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th className="px-4 py-3" key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <LoadingRows colSpan={colSpan} />
            ) : isError ? (
              <tr>
                <td className="px-4 py-14 text-center" colSpan={colSpan}>
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                      <AlertTriangle className="size-5" aria-hidden="true" />
                    </div>
                    <p className="mt-4 font-medium">Не удалось загрузить журнал</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Проверьте подключение к API и повторите запрос.
                    </p>
                    <Button className="mt-4" onClick={onRetry} variant="outline">
                      <RefreshCw aria-hidden="true" />
                      Повторить
                    </Button>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  className="border-b transition-colors last:border-b-0 hover:bg-muted/50"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="px-4 py-3 align-middle text-sm" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-14 text-center" colSpan={colSpan}>
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
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LoadingRows({ colSpan }: { colSpan: number }) {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr className="border-b last:border-b-0" key={index}>
      <td className="px-4 py-3" colSpan={colSpan}>
        <div className="grid grid-cols-[120px_180px_120px_80px_1fr_1fr_96px] gap-4">
          {Array.from({ length: colSpan }).map((__, cellIndex) => (
            <div
              className="h-5 animate-pulse rounded-sm bg-muted"
              key={cellIndex}
            />
          ))}
        </div>
      </td>
    </tr>
  ));
}

function formatDate(value: string) {
  try {
    return format(parseISO(value), "dd.MM.yyyy");
  } catch {
    return value;
  }
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(value);
}
