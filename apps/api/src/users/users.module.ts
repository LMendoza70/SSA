import { Module } from '@nestjs/common';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['IUserRepository', UsersService],
})
export class UsersModule {}
