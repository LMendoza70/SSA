import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SocialPublisher } from './social-publisher.interface';
import { FacebookAdapter } from './facebook.adapter';
import { InstagramAdapter } from './instagram.adapter';
import { XAdapter } from './x.adapter';
import { TikTokAdapter } from './tiktok.adapter';
import { YouTubeAdapter } from './youtube.adapter';
import { WhatsAppAdapter } from './whatsapp.adapter';

@Injectable()
export class SocialPublisherFactory implements OnApplicationBootstrap {
  private readonly registry = new Map<string, SocialPublisher>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly facebook: FacebookAdapter,
    private readonly instagram: InstagramAdapter,
    private readonly x: XAdapter,
    private readonly tiktok: TikTokAdapter,
    private readonly youtube: YouTubeAdapter,
    private readonly whatsapp: WhatsAppAdapter,
  ) {}

  onApplicationBootstrap() {
    this.register(this.facebook);
    this.register(this.instagram);
    this.register(this.x);
    this.register(this.tiktok);
    this.register(this.youtube);
    this.register(this.whatsapp);
  }

  private register(adapter: SocialPublisher) {
    this.registry.set(adapter.channelType, adapter);
  }

  getAdapter(channelType: string): SocialPublisher | undefined {
    return this.registry.get(channelType);
  }

  getAvailableChannels(): string[] {
    return Array.from(this.registry.keys());
  }
}
