import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { PrismaValidationRepository } from './validation.repository';

@Module({
  controllers: [ValidationController],
  providers: [
    ValidationService,
    { provide: 'IValidationRepository', useClass: PrismaValidationRepository },
  ],
})
export class ValidationModule {}
