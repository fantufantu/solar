import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
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
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
