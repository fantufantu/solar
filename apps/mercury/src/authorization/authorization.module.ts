import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationService } from './authorization.service.js';
import { AuthorizationResolver } from './authorization.resolver.js';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authorization])],
  providers: [AuthorizationResolver, AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
