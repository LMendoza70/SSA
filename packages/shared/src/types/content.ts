import type { ContentStatus } from '../enums';

export interface ContentDto {
  id: string;
  contentTypeId: string;
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  status: ContentStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentInput {
  contentTypeId: string;
  title: string;
  summary?: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  id: string;
}
