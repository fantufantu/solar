import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';
import { MembershipModule } from '../membership/membership.module';
import { TouristPlanModule } from '../tourist-plan/tourist-plan.module';

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
