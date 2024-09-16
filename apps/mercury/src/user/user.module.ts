import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from '../../../../libs/database/src/entities/mercury/user.entity';
import { UserVerification } from '../../../../libs/database/src/entities/mercury/user-verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserVerification])],
  controllers: [UserController],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
