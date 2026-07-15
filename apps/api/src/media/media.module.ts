import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { LocalStorageProvider } from './local-storage.provider';

@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    { provide: 'STORAGE_PROVIDER', useClass: LocalStorageProvider },
  ],
  exports: [MediaService, 'STORAGE_PROVIDER'],
})
export class MediaModule {}
