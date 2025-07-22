import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Role } from '@/libs/database/entities/mercury/role.entity';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
