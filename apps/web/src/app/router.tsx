import { WorkJournalPage } from "@/pages/work-journal/work-journal-page";
import { AppLayout } from "@/widgets/app-layout/app-layout";

export function AppRouter() {
  return (
    <AppLayout>
      <WorkJournalPage />
    </AppLayout>
  );
}
