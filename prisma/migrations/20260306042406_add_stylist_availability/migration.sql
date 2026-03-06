-- CreateTable
CREATE TABLE "StylistAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stylistId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StylistAvailability_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "Stylist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StylistAvailability_stylistId_dayOfWeek_key" ON "StylistAvailability"("stylistId", "dayOfWeek");
