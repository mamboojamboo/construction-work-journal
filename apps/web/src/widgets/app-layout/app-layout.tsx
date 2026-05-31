import type { PropsWithChildren } from "react";
import { Building2, ClipboardList } from "lucide-react";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Construction Work Journal
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Внутренний журнал выполненных работ
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground sm:flex">
            <ClipboardList className="size-4" aria-hidden="true" />
            Смена: дневная
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
