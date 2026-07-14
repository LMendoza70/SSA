import { Module } from '@nestjs/common';
import { PrismaUserRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}
