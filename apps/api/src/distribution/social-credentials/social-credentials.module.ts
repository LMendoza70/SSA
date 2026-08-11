import { Module } from '@nestjs/common';
import { SocialCredentialService } from './social-credential.service';
import { SocialCredentialController } from './social-credential.controller';
import { SocialOAuthService } from './social-oauth.service';
import { FacebookApiService } from './facebook-api.client';
import { InstagramApiService } from './instagram-api.client';
import { YouTubeApiService } from './youtube-api.client';
import { ContentAnalyzer } from './content-analyzer.service';

@Module({
  controllers: [SocialCredentialController],
  imports: [],
  providers: [
    SocialCredentialService,
    SocialOAuthService,
    FacebookApiService,
    InstagramApiService,
    YouTubeApiService,
    ContentAnalyzer,
  ],
  exports: [
    SocialCredentialService,
    SocialOAuthService,
    FacebookApiService,
    InstagramApiService,
    YouTubeApiService,
    ContentAnalyzer,
  ],
})
export class SocialCredentialsModule {}