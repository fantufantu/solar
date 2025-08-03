import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Authorization])],
  providers: [AuthorizationResolver, AuthorizationService],
})
export class AuthorizationModule {}
