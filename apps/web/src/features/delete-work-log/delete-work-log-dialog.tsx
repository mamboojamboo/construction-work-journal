import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useDeleteWorkLog,
  type WorkLogResponseDto,
} from "@/shared/api/generated/work-journal-api";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type DeleteWorkLogDialogProps = {
  open: boolean;
  record: WorkLogResponseDto | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteWorkLogDialog({
  open,
  record,
  onOpenChange,
}: DeleteWorkLogDialogProps) {
  const queryClient = useQueryClient();
  const deleteWorkLogMutation = useDeleteWorkLog({
    mutation: {
      onError: (error) => {
        toast.error("Не удалось удалить запись", {
          description: getApiErrorMessage(error),
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["/work-logs"] });
        onOpenChange(false);
        toast.success("Запись удалена");
      },
    },
  });

  const handleDelete = () => {
    if (!record) {
      return;
    }

    deleteWorkLogMutation.mutate({ id: record.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle>Удалить запись?</DialogTitle>
          <DialogDescription>
            Это действие удалит запись из журнала работ и базы данных.
          </DialogDescription>
        </DialogHeader>

        {record ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Дата
                </dt>
                <dd className="mt-1 font-medium">
                  {formatDate(record.performedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Вид работ
                </dt>
                <dd className="mt-1 font-medium">{record.workType.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Объем
                </dt>
                <dd className="mt-1 font-medium">
                  {formatQuantity(record.quantity)} {record.workType.unit}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">
                  Исполнитель
                </dt>
                <dd className="mt-1 font-medium">{record.performer}</dd>
              </div>
            </dl>
            {record.comment ? (
              <p className="mt-3 border-t pt-3 text-muted-foreground">
                {record.comment}
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            disabled={deleteWorkLogMutation.isPending}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Отмена
          </Button>
          <Button
            disabled={deleteWorkLogMutation.isPending || !record}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            <Trash2 aria-hidden="true" />
            {deleteWorkLogMutation.isPending ? "Удаление..." : "Удалить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
