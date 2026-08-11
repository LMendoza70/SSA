-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PREPARED', 'NEEDS_REVIEW', 'READY_FOR_PUBLICATION', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('PUBLISHED', 'UPDATED', 'WITHDRAWN', 'ARCHIVED', 'HISTORICALLY_CONTEXTUALIZED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('OFFICIAL_EXTERNAL', 'INSTITUTIONAL_INTERNAL', 'DOCUMENTARY', 'HISTORICAL', 'JURISDICTION_GENERATED');

-- CreateEnum
CREATE TYPE "ValidationType" AS ENUM ('AUTHENTICITY', 'VALIDITY', 'RELEVANCE', 'INSTITUTIONAL_COMPLETE');

-- CreateEnum
CREATE TYPE "ValidationResult" AS ENUM ('APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION');

-- CreateEnum
CREATE TYPE "MediaResourceType" AS ENUM ('IMAGE', 'INFOGRAPHIC', 'PDF', 'DOCUMENT', 'VIDEO_LINK', 'EXTERNAL_LINK');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC_PORTAL', 'FACEBOOK', 'INSTAGRAM', 'X', 'TIKTOK', 'YOUTUBE', 'WHATSAPP', 'OTHER');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PREPARED', 'MANUALLY_SHARED', 'NOT_SHARED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TraceabilityAction" AS ENUM ('CREATED', 'UPDATED', 'VALIDATED', 'PREPARED', 'PUBLISHED', 'DISTRIBUTION_PREPARED', 'DISTRIBUTED', 'WITHDRAWN', 'ARCHIVED', 'RESTORED', 'CLASSIFIED', 'RESOURCE_ATTACHED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" TEXT NOT NULL,
    "contentTypeId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "publicSlug" TEXT NOT NULL,
    "publicTitle" TEXT,
    "publishedAt" TIMESTAMP(3),
    "updatedAtPublic" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "institutionalResponsibility" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organization" TEXT,
    "url" TEXT,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validations" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT,
    "validatedById" TEXT,
    "type" "ValidationType" NOT NULL,
    "result" "ValidationResult" NOT NULL,
    "summary" TEXT,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "objective" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_resources" (
    "id" TEXT NOT NULL,
    "type" "MediaResourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "resourceUri" TEXT,
    "externalUrl" TEXT,
    "mimeType" TEXT,
    "altText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "media_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "occurredAt" TIMESTAMP(3),
    "periodLabel" TEXT,
    "historicalRelevance" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_channels" (
    "id" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "communication_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traceability_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT,
    "publicationId" TEXT,
    "sourceId" TEXT,
    "validationId" TEXT,
    "action" "TraceabilityAction" NOT NULL,
    "summary" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "institutionalResponsibility" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "traceability_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_sources" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_validations" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "validationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_campaigns" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_diseases" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_diseases" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_media_resources" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "mediaResourceId" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_media_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_categories" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tags" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_channels" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "communicationChannelId" TEXT NOT NULL,
    "status" "DistributionStatus" NOT NULL DEFAULT 'PREPARED',
    "preparedText" TEXT,
    "preparedAt" TIMESTAMP(3),
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publication_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_event_contents" (
    "id" TEXT NOT NULL,
    "timelineEventId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_event_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_event_media_resources" (
    "id" TEXT NOT NULL,
    "timelineEventId" TEXT NOT NULL,
    "mediaResourceId" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_event_media_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "content_types_code_key" ON "content_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "contents_slug_key" ON "contents"("slug");

-- CreateIndex
CREATE INDEX "contents_contentTypeId_idx" ON "contents"("contentTypeId");

-- CreateIndex
CREATE INDEX "contents_status_idx" ON "contents"("status");

-- CreateIndex
CREATE INDEX "contents_createdAt_idx" ON "contents"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "publications_contentId_key" ON "publications"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "publications_publicSlug_key" ON "publications"("publicSlug");

-- CreateIndex
CREATE INDEX "publications_status_idx" ON "publications"("status");

-- CreateIndex
CREATE INDEX "publications_publishedAt_idx" ON "publications"("publishedAt");

-- CreateIndex
CREATE INDEX "publications_isVisible_idx" ON "publications"("isVisible");

-- CreateIndex
CREATE INDEX "sources_type_idx" ON "sources"("type");

-- CreateIndex
CREATE INDEX "sources_isOfficial_idx" ON "sources"("isOfficial");

-- CreateIndex
CREATE INDEX "validations_sourceId_idx" ON "validations"("sourceId");

-- CreateIndex
CREATE INDEX "validations_validatedById_idx" ON "validations"("validatedById");

-- CreateIndex
CREATE INDEX "validations_type_idx" ON "validations"("type");

-- CreateIndex
CREATE INDEX "validations_result_idx" ON "validations"("result");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- CreateIndex
CREATE INDEX "campaigns_isActive_idx" ON "campaigns"("isActive");

-- CreateIndex
CREATE INDEX "campaigns_startsAt_idx" ON "campaigns"("startsAt");

-- CreateIndex
CREATE INDEX "campaigns_endsAt_idx" ON "campaigns"("endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "diseases_slug_key" ON "diseases"("slug");

-- CreateIndex
CREATE INDEX "diseases_isActive_idx" ON "diseases"("isActive");

-- CreateIndex
CREATE INDEX "media_resources_type_idx" ON "media_resources"("type");

-- CreateIndex
CREATE INDEX "media_resources_isActive_idx" ON "media_resources"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_events_slug_key" ON "timeline_events"("slug");

-- CreateIndex
CREATE INDEX "timeline_events_occurredAt_idx" ON "timeline_events"("occurredAt");

-- CreateIndex
CREATE INDEX "timeline_events_isVisible_idx" ON "timeline_events"("isVisible");

-- CreateIndex
CREATE INDEX "communication_channels_type_idx" ON "communication_channels"("type");

-- CreateIndex
CREATE INDEX "communication_channels_isActive_idx" ON "communication_channels"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_isActive_idx" ON "tags"("isActive");

-- CreateIndex
CREATE INDEX "traceability_records_userId_idx" ON "traceability_records"("userId");

-- CreateIndex
CREATE INDEX "traceability_records_contentId_idx" ON "traceability_records"("contentId");

-- CreateIndex
CREATE INDEX "traceability_records_publicationId_idx" ON "traceability_records"("publicationId");

-- CreateIndex
CREATE INDEX "traceability_records_sourceId_idx" ON "traceability_records"("sourceId");

-- CreateIndex
CREATE INDEX "traceability_records_validationId_idx" ON "traceability_records"("validationId");

-- CreateIndex
CREATE INDEX "traceability_records_action_idx" ON "traceability_records"("action");

-- CreateIndex
CREATE INDEX "traceability_records_occurredAt_idx" ON "traceability_records"("occurredAt");

-- CreateIndex
CREATE INDEX "content_sources_sourceId_idx" ON "content_sources"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "content_sources_contentId_sourceId_key" ON "content_sources"("contentId", "sourceId");

-- CreateIndex
CREATE INDEX "content_validations_validationId_idx" ON "content_validations"("validationId");

-- CreateIndex
CREATE UNIQUE INDEX "content_validations_contentId_validationId_key" ON "content_validations"("contentId", "validationId");

-- CreateIndex
CREATE INDEX "content_campaigns_campaignId_idx" ON "content_campaigns"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "content_campaigns_contentId_campaignId_key" ON "content_campaigns"("contentId", "campaignId");

-- CreateIndex
CREATE INDEX "content_diseases_diseaseId_idx" ON "content_diseases"("diseaseId");

-- CreateIndex
CREATE UNIQUE INDEX "content_diseases_contentId_diseaseId_key" ON "content_diseases"("contentId", "diseaseId");

-- CreateIndex
CREATE INDEX "campaign_diseases_diseaseId_idx" ON "campaign_diseases"("diseaseId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_diseases_campaignId_diseaseId_key" ON "campaign_diseases"("campaignId", "diseaseId");

-- CreateIndex
CREATE INDEX "content_media_resources_mediaResourceId_idx" ON "content_media_resources"("mediaResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "content_media_resources_contentId_mediaResourceId_key" ON "content_media_resources"("contentId", "mediaResourceId");

-- CreateIndex
CREATE INDEX "content_categories_categoryId_idx" ON "content_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "content_categories_contentId_categoryId_key" ON "content_categories"("contentId", "categoryId");

-- CreateIndex
CREATE INDEX "content_tags_tagId_idx" ON "content_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "content_tags_contentId_tagId_key" ON "content_tags"("contentId", "tagId");

-- CreateIndex
CREATE INDEX "publication_channels_communicationChannelId_idx" ON "publication_channels"("communicationChannelId");

-- CreateIndex
CREATE INDEX "publication_channels_status_idx" ON "publication_channels"("status");

-- CreateIndex
CREATE UNIQUE INDEX "publication_channels_publicationId_communicationChannelId_key" ON "publication_channels"("publicationId", "communicationChannelId");

-- CreateIndex
CREATE INDEX "timeline_event_contents_contentId_idx" ON "timeline_event_contents"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_event_contents_timelineEventId_contentId_key" ON "timeline_event_contents"("timelineEventId", "contentId");

-- CreateIndex
CREATE INDEX "timeline_event_media_resources_mediaResourceId_idx" ON "timeline_event_media_resources"("mediaResourceId");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_event_media_resources_timelineEventId_mediaResourc_key" ON "timeline_event_media_resources"("timelineEventId", "mediaResourceId");

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validations" ADD CONSTRAINT "validations_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traceability_records" ADD CONSTRAINT "traceability_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traceability_records" ADD CONSTRAINT "traceability_records_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traceability_records" ADD CONSTRAINT "traceability_records_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traceability_records" ADD CONSTRAINT "traceability_records_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traceability_records" ADD CONSTRAINT "traceability_records_validationId_fkey" FOREIGN KEY ("validationId") REFERENCES "validations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_sources" ADD CONSTRAINT "content_sources_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_sources" ADD CONSTRAINT "content_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_validations" ADD CONSTRAINT "content_validations_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_validations" ADD CONSTRAINT "content_validations_validationId_fkey" FOREIGN KEY ("validationId") REFERENCES "validations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_campaigns" ADD CONSTRAINT "content_campaigns_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_campaigns" ADD CONSTRAINT "content_campaigns_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_diseases" ADD CONSTRAINT "content_diseases_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_diseases" ADD CONSTRAINT "content_diseases_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_diseases" ADD CONSTRAINT "campaign_diseases_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_diseases" ADD CONSTRAINT "campaign_diseases_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media_resources" ADD CONSTRAINT "content_media_resources_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media_resources" ADD CONSTRAINT "content_media_resources_mediaResourceId_fkey" FOREIGN KEY ("mediaResourceId") REFERENCES "media_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tags" ADD CONSTRAINT "content_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_channels" ADD CONSTRAINT "publication_channels_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_channels" ADD CONSTRAINT "publication_channels_communicationChannelId_fkey" FOREIGN KEY ("communicationChannelId") REFERENCES "communication_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_contents" ADD CONSTRAINT "timeline_event_contents_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "timeline_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_contents" ADD CONSTRAINT "timeline_event_contents_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_media_resources" ADD CONSTRAINT "timeline_event_media_resources_timelineEventId_fkey" FOREIGN KEY ("timelineEventId") REFERENCES "timeline_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_event_media_resources" ADD CONSTRAINT "timeline_event_media_resources_mediaResourceId_fkey" FOREIGN KEY ("mediaResourceId") REFERENCES "media_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
