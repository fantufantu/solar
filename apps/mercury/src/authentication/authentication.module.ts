import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationResolver } from './authentication.resolver';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
