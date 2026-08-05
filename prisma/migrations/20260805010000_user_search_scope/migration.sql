-- CreateTable
CREATE TABLE "UserSearchScope" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobKeywords" JSONB NOT NULL DEFAULT '[]',
    "jobQuery" TEXT NOT NULL DEFAULT '',
    "courseQuery" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSearchScope_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSearchScope_userId_key" ON "UserSearchScope"("userId");

-- AddForeignKey
ALTER TABLE "UserSearchScope" ADD CONSTRAINT "UserSearchScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
