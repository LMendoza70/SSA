import { Module } from '@nestjs/common';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { PrismaSourceRepository } from './source.repository';

@Module({
  controllers: [SourceController],
  providers: [
    SourceService,
    { provide: 'ISourceRepository', useClass: PrismaSourceRepository },
  ],
})
export class SourceModule {}
