// nest
import { Module } from '@nestjs/common';
// project
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
