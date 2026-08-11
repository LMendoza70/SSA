-- CreateTable
CREATE TABLE "social_credentials" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "credentialKey" TEXT NOT NULL,
    "credentialValue" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_credentials_platform_idx" ON "social_credentials"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "social_credentials_platform_credentialKey_key" ON "social_credentials"("platform", "credentialKey");
