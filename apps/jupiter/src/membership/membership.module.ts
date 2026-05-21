import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from '@/libs/database/entities/jupiter/membership.entity';
import { MembershipService } from './membership.service';
import { MembershipResolver } from './membership.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  providers: [MembershipService, MembershipResolver],
  exports: [MembershipService],
})
export class MembershipModule {}
