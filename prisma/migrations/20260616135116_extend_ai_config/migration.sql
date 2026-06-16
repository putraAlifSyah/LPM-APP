-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AiConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "model" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "apiKey" TEXT NOT NULL DEFAULT '',
    "baseUrl" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "systemPromptExtra" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AiConfig" ("apiKey", "id", "model", "provider", "updatedAt") SELECT "apiKey", "id", "model", "provider", "updatedAt" FROM "AiConfig";
DROP TABLE "AiConfig";
ALTER TABLE "new_AiConfig" RENAME TO "AiConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
