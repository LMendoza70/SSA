export interface PublishableContent {
  title: string;
  summary?: string;
  body?: string;
  publicUrl: string;
  mediaUrls?: string[];
  institutionalResponsibility?: string;
}

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
  errorMessage?: string;
  publishedAt: Date;
}

export interface SocialPublisher {
  readonly channelType: string;
  publish(content: PublishableContent): Promise<PublishResult>;
}
