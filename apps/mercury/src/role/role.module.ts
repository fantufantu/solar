import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { RoleController } from './role.controller';
import { RoleWithUser } from '@/libs/database/entities/mercury/role-with-user.entity';
import { AuthorizationModule } from '../authorization/authorization.module';
import { RoleWithAuthorization } from '@/libs/database/entities/mercury/role_with_authorization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleWithUser, RoleWithAuthorization]),
    AuthorizationModule,
  ],
  controllers: [RoleController],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
