import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service.js';
import { AuthenticationResolver } from './authentication.resolver.js';
import { UserModule } from '../user/user.module.js';
import { AuthenticationController } from './authentication.controller.js';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationResolver, AuthenticationService],
})
export class AuthenticationModule {}
