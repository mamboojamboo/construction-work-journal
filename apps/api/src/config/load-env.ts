import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config } from "dotenv";

export function loadEnv() {
  const envFiles = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "../../.env"),
  ];

  for (const envFile of envFiles) {
    if (existsSync(envFile)) {
      config({ path: envFile, override: false });
    }
  }
}
