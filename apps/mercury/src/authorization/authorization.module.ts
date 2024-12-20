import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';
import { AuthorizationResource } from '@/libs/database/entities/mercury/authorization-resource.entity';
import { AuthorizationAction } from '@/libs/database/entities/mercury/authorization-action.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Authorization,
      AuthorizationResource,
      AuthorizationAction,
    ]),
  ],
  providers: [AuthorizationResolver, AuthorizationService],
})
export class AuthorizationModule {}
