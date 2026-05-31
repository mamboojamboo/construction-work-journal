import { defineConfig } from "orval";

export default defineConfig({
  workJournalApi: {
    input: "http://localhost:3000/api/docs-json",
    output: {
      target: "./src/shared/api/generated/work-journal-api.ts",
      client: "react-query",
      httpClient: "axios",
      prettier: true,
      override: {
        mutator: {
          path: "./src/shared/api/http-client.ts",
          name: "customInstance",
        },
      },
    },
  },
});
