import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentTypeController } from './content-type.controller';
import { ContentService } from './content.service';

@Module({
  controllers: [ContentController, ContentTypeController],
  providers: [ContentService],
})
export class ContentModule {}
