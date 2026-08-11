export interface MediaUrlInfo {
  url: string;
  mimeType?: string;
  /** Ruta local del archivo en el servidor (para subidas multipart a redes sociales). */
  filePath?: string;
}

export interface PublishableContent {
  title: string;
  summary?: string;
  body?: string;
  publicUrl: string;
  publicSlug?: string;
  mediaUrls?: MediaUrlInfo[];
  institutionalResponsibility?: string;
  /** URL pública temporal de la imagen, usada por redes que exigen imagen pública (Instagram). */
  temporalImageUrl?: string;
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