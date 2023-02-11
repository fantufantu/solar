// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Authorization } from './entities/authorization.entity';
import { AuthorizationResource } from './entities/authorization-resource.entity';
import { AuthorizationAction } from './entities/authorization-action.entity';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TenantModule,
    UserModule,
    TypeOrmModule.forFeature([
      Authorization,
      AuthorizationResource,
      AuthorizationAction,
    ]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
