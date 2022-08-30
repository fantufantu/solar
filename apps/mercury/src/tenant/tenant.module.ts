// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';
import { Tenant } from './entities/tenant.entity';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [MenuModule, TypeOrmModule.forFeature([Tenant])],
  providers: [TenantResolver, TenantService],
  exports: [TenantService],
})
export class TenantModule {}
