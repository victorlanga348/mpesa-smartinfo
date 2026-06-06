-- CreateTable
CREATE TABLE "AgentRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgentRating_pingId_fkey" FOREIGN KEY ("pingId") REFERENCES "Ping" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AgentRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AgentRating_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentRating_pingId_userId_key" ON "AgentRating"("pingId", "userId");

-- CreateIndex
CREATE INDEX "AgentRating_agentId_idx" ON "AgentRating"("agentId");
