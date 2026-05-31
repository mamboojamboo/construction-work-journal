import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { WorkLogForm } from "@/entities/work-log/ui/work-log-form";
import {
  useCreateWorkLog,
  type CreateWorkLogDto,
  type WorkTypeResponseDto,
} from "@/shared/api/generated/work-journal-api";
import { getApiErrorMessage } from "@/shared/api/get-api-error-message";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

type CreateWorkLogDialogProps = {
  isWorkTypesError: boolean;
  isWorkTypesLoading: boolean;
  workTypes: WorkTypeResponseDto[];
};

export function CreateWorkLogDialog({
  isWorkTypesError,
  isWorkTypesLoading,
  workTypes,
}: CreateWorkLogDialogProps) {
  const [open, setOpen] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const createWorkLogMutation = useCreateWorkLog({
    mutation: {
      onError: (error) => {
        toast.error("Не удалось создать запись", {
          description: getApiErrorMessage(error),
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["/work-logs"] });
        setOpen(false);
        toast.success("Запись добавлена");
      },
    },
  });

  const handleSubmit = (values: CreateWorkLogDto) => {
    createWorkLogMutation.mutate({ data: values });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button title="Добавление записи">
          <Plus aria-hidden="true" />
          Добавить запись
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая запись в журнале</DialogTitle>
          <DialogDescription>
            Дневная фиксация выполненных строительных работ на участке.
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
              Без справочника нельзя выбрать вид работ для новой записи.
            </p>
          </div>
        ) : null}

        {!isWorkTypesLoading && !isWorkTypesError ? (
          <WorkLogForm
            defaultValues={{ performedAt: today }}
            isSubmitting={createWorkLogMutation.isPending}
            maxPerformedAt={today}
            onCancel={() => setOpen(false)}
            onSubmit={handleSubmit}
            submitLabel="Добавить запись"
            workTypes={workTypes}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
