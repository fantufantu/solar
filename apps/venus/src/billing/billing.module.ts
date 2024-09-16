import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharingModule } from '../sharing/sharing.module';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { BillingLoader } from './billing.loader';
import { Billing } from '@/lib/database/entities/venus/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Billing]), SharingModule],
  providers: [BillingLoader, BillingService, BillingResolver],
  exports: [BillingService],
})
export class BillingModule {}
