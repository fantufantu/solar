import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/libs/database/entities/jupiter/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TouristPlan } from '@/libs/database/entities/jupiter/tourist-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TouristPlan])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
