// nest
import { PickType } from '@nestjs/graphql';
// project
import { User } from 'apps/mercury/src/entities';

export class Authentication extends PickType(User, ['id']) {}
