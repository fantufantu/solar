// nest
import { PickType } from '@nestjs/graphql';
// project
import { User } from 'apps/mercury/src/auth/entities/user.entity';

export class Authentication extends PickType(User, ['id']) {}
