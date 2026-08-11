export const ContentStatus = {
  DRAFT: 'DRAFT',
  PREPARED: 'PREPARED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  READY_FOR_PUBLICATION: 'READY_FOR_PUBLICATION',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

export const PublicationStatus = {
  PUBLISHED: 'PUBLISHED',
  UPDATED: 'UPDATED',
  WITHDRAWN: 'WITHDRAWN',
  ARCHIVED: 'ARCHIVED',
  HISTORICALLY_CONTEXTUALIZED: 'HISTORICALLY_CONTEXTUALIZED',
} as const;

export type PublicationStatus = (typeof PublicationStatus)[keyof typeof PublicationStatus];

export const ContentTypeCode = {
  NEWS: 'news',
  NOTICE: 'notice',
  STATEMENT: 'statement',
  DOCUMENT: 'document',
  INFOGRAPHIC: 'infographic',
  FAQ: 'faq',
  PROGRAM: 'program',
  EVENT: 'event',
  INSTITUTIONAL: 'institutional',
} as const;

export type ContentTypeCode = (typeof ContentTypeCode)[keyof typeof ContentTypeCode];
