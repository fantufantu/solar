import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { UserService } from './user.service.js';
import { UserResolver } from './user.resolver.js';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { MembershipModule } from '../membership/membership.module.js';
import { TouristPlanModule } from '../tourist-plan/tourist-plan.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TouristPlan]),
    MembershipModule,
    forwardRef(() => TouristPlanModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
