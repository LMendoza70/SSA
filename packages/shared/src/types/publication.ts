import type { PublicationStatus } from '../enums';

export interface PublicationDto {
  id: string;
  contentId: string;
  status: PublicationStatus;
  publicSlug: string;
  publicTitle?: string;
  publishedAt?: string;
  isVisible: boolean;
}
