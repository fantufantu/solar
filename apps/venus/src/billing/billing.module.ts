// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { SharingModule } from '../sharing/sharing.module';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { BillingLoader } from './billing.loader';
import { UserProfileModule } from '../user/user.module';
import { Billing } from './entities/billing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Billing]),
    UserProfileModule,
    SharingModule,
  ],
  providers: [BillingLoader, BillingService, BillingResolver],
})
export class BillingModule {}
