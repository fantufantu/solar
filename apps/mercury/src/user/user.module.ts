import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { UserEmail } from './entities/user-email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserEmail])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
