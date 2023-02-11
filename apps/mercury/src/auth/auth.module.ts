// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { User } from '../user/entities/user.entity';
import { UserEmail } from '../user/entities/user-email.entity';
import { Authorization } from './entities/authorization.entity';
import { AuthorizationResource } from './entities/authorization-resource.entity';
import { AuthorizationAction } from './entities/authorization-action.entity';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    TenantModule,
    TypeOrmModule.forFeature([
      User,
      UserEmail,
      Authorization,
      AuthorizationResource,
      AuthorizationAction,
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
