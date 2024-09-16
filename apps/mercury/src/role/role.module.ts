import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { Role } from '@/lib/database/entities/mercury/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
