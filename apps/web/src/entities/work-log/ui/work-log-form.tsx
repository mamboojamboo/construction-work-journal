import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  CreateWorkLogDto,
  WorkTypeResponseDto,
} from "@/shared/api/generated/work-journal-api";
import { Button } from "@/shared/ui/button";

const workLogFormSchema = z.object({
  performedAt: z.string().min(1, "Укажите дату выполнения работ."),
  workTypeId: z.string().min(1, "Выберите вид работ."),
  quantity: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    z
      .number({ message: "Укажите объем работ." })
      .positive("Объем должен быть больше 0."),
  ),
  performer: z
    .string()
    .trim()
    .min(2, "Укажите ФИО исполнителя минимум из 2 символов.")
    .max(160, "ФИО исполнителя не должно быть длиннее 160 символов."),
  comment: z
    .string()
    .trim()
    .max(1000, "Комментарий не должен быть длиннее 1000 символов.")
    .optional()
    .or(z.literal("")),
});

type WorkLogFormValues = z.output<typeof workLogFormSchema>;
type WorkLogFormInput = z.input<typeof workLogFormSchema>;

type WorkLogFormProps = {
  defaultValues?: Partial<WorkLogFormInput>;
  isSubmitting: boolean;
  submitLabel: string;
  workTypes: WorkTypeResponseDto[];
  onCancel: () => void;
  onSubmit: (values: CreateWorkLogDto) => void;
};

const emptyValues: WorkLogFormInput = {
  performedAt: "",
  workTypeId: "",
  quantity: "",
  performer: "",
  comment: "",
};

export function WorkLogForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  workTypes,
  onCancel,
  onSubmit,
}: WorkLogFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<WorkLogFormInput, unknown, WorkLogFormValues>({
    defaultValues: {
      ...emptyValues,
      ...defaultValues,
    },
    resolver: zodResolver(workLogFormSchema),
  });

  const selectedWorkTypeId = watch("workTypeId");
  const selectedWorkType = useMemo(
    () => workTypes.find((workType) => workType.id === selectedWorkTypeId),
    [selectedWorkTypeId, workTypes],
  );

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          performedAt: values.performedAt,
          workTypeId: values.workTypeId,
          quantity: values.quantity,
          performer: values.performer.trim(),
          comment: values.comment?.trim() || undefined,
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Дата выполнения" message={errors.performedAt?.message}>
          <input
            className={inputClassName}
            type="date"
            {...register("performedAt")}
          />
        </Field>

        <Field label="Вид работ" message={errors.workTypeId?.message}>
          <select className={inputClassName} {...register("workTypeId")}>
            <option value="">Выберите вид работ</option>
            {workTypes.map((workType) => (
              <option key={workType.id} value={workType.id}>
                {workType.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Field
          hint={
            selectedWorkType
              ? `Единица измерения: ${selectedWorkType.unit}`
              : undefined
          }
          label="Объем"
          message={errors.quantity?.message}
        >
          <input
            className={inputClassName}
            min="0.01"
            step="0.01"
            type="number"
            {...register("quantity")}
          />
        </Field>

        <Field label="Исполнитель" message={errors.performer?.message}>
          <input
            className={inputClassName}
            placeholder="Иванов Иван Иванович"
            type="text"
            {...register("performer")}
          />
        </Field>
      </div>

      <Field label="Комментарий" message={errors.comment?.message}>
        <textarea
          className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Необязательное уточнение по выполненным работам"
          {...register("comment")}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Отмена
        </Button>
        <Button disabled={isSubmitting} type="submit">
          <Save aria-hidden="true" />
          {isSubmitting ? "Сохранение..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  children: ReactNode;
  hint?: string;
  label: string;
  message?: string;
};

function Field({ children, hint, label, message }: FieldProps) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {message ? (
        <span className="block text-xs font-medium text-destructive">
          {message}
        </span>
      ) : null}
      {hint && !message ? (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

const inputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
