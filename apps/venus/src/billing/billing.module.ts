// nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// project
import { ShareModule } from '../share/share.module';
import { BillingService } from './billing.service';
import { BillingResolver } from './billing.resolver';
import { BillingLoader } from './billing.loader';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { Billing } from './entities/billing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Billing]),
    UserProfileModule,
    ShareModule,
  ],
  providers: [BillingLoader, BillingService, BillingResolver],
})
export class BillingModule {}
