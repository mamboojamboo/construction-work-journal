import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { WorkLogForm } from "@/entities/work-log/ui/work-log-form";
import {
  useUpdateWorkLog,
  type CreateWorkLogDto,
  type WorkLogResponseDto,
  type WorkTypeResponseDto,
} from "@/shared/api/generated/work-journal-api";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type EditWorkLogDialogProps = {
  isWorkTypesError: boolean;
  isWorkTypesLoading: boolean;
  open: boolean;
  record: WorkLogResponseDto | null;
  workTypes: WorkTypeResponseDto[];
  onOpenChange: (open: boolean) => void;
};

export function EditWorkLogDialog({
  isWorkTypesError,
  isWorkTypesLoading,
  open,
  record,
  workTypes,
  onOpenChange,
}: EditWorkLogDialogProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const updateWorkLogMutation = useUpdateWorkLog({
    mutation: {
      onError: (error) => {
        toast.error("Не удалось обновить запись", {
          description: getApiErrorMessage(error),
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["/work-logs"] });
        onOpenChange(false);
        toast.success("Запись обновлена");
      },
    },
  });

  const handleSubmit = (values: CreateWorkLogDto) => {
    if (!record) {
      return;
    }

    updateWorkLogMutation.mutate({
      id: record.id,
      data: values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование записи</DialogTitle>
          <DialogDescription>
            Измените данные выполненных работ и сохраните обновление в журнале.
          </DialogDescription>
        </DialogHeader>

        {isWorkTypesLoading ? (
          <div className="flex min-h-56 items-center justify-center rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            Загружаем справочник видов работ
          </div>
        ) : null}

        {isWorkTypesError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Не удалось загрузить виды работ
            </div>
            <p className="mt-2 text-destructive/80">
              Без справочника нельзя корректно изменить вид работ.
            </p>
          </div>
        ) : null}

        {record && !isWorkTypesLoading && !isWorkTypesError ? (
          <WorkLogForm
            defaultValues={{
              comment: record.comment ?? "",
              performedAt: record.performedAt.slice(0, 10),
              performer: record.performer,
              quantity: record.quantity,
              workTypeId: record.workTypeId,
            }}
            isSubmitting={updateWorkLogMutation.isPending}
            maxPerformedAt={today}
            onCancel={() => onOpenChange(false)}
            onSubmit={handleSubmit}
            submitLabel="Сохранить изменения"
            workTypes={workTypes}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
