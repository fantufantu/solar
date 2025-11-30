import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { RoleWithUser } from '@/libs/database/entities/mercury/role-with-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleWithUser])],
  controllers: [UserController],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
