import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharingModule } from '../sharing/sharing.module.js';
import { BillingService } from './billing.service.js';
import { BillingResolver } from './billing.resolver.js';
import { BillingLoader } from './billing.loader.js';
import { Billing } from '@/libs/database/entities/venus/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Billing]), SharingModule],
  providers: [BillingLoader, BillingService, BillingResolver],
  exports: [BillingService],
})
export class BillingModule {}
