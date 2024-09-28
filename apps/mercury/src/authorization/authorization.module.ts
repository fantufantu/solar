import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { Authorization } from '@/lib/database/entities/mercury/authorization.entity';
import { AuthorizationResource } from '@/lib/database/entities/mercury/authorization-resource.entity';
import { AuthorizationAction } from '@/lib/database/entities/mercury/authorization-action.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Authorization,
      AuthorizationResource,
      AuthorizationAction,
    ]),
  ],
  providers: [AuthorizationResolver, AuthorizationService],
})
export class AuthorizationModule {}
