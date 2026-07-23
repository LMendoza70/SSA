CREATE TYPE "PublicationReviewDecision" AS ENUM ('APPROVED', 'CHANGES_REQUESTED');

ALTER TYPE "TraceabilityAction" ADD VALUE IF NOT EXISTS 'APPROVED_FOR_PUBLICATION';
ALTER TYPE "TraceabilityAction" ADD VALUE IF NOT EXISTS 'CHANGES_REQUESTED';

CREATE TABLE "publication_reviews" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "reviewedById" TEXT NOT NULL,
    "decision" "PublicationReviewDecision" NOT NULL,
    "informationAccurate" BOOLEAN NOT NULL,
    "informationCurrent" BOOLEAN NOT NULL,
    "editorialQuality" BOOLEAN NOT NULL,
    "mediaAuthorized" BOOLEAN NOT NULL,
    "institutionalResponsibilityConfirmed" BOOLEAN NOT NULL,
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "publication_reviews_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "publication_reviews_contentId_key" ON "publication_reviews"("contentId");
CREATE INDEX "publication_reviews_reviewedById_idx" ON "publication_reviews"("reviewedById");
CREATE INDEX "publication_reviews_decision_idx" ON "publication_reviews"("decision");
CREATE INDEX "publication_reviews_isCurrent_idx" ON "publication_reviews"("isCurrent");

ALTER TABLE "publication_reviews" ADD CONSTRAINT "publication_reviews_contentId_fkey"
  FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "publication_reviews" ADD CONSTRAINT "publication_reviews_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
