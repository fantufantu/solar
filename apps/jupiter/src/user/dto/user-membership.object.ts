import { Membership } from '@/libs/database/entities/jupiter/membership.entity';
import { ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class UserMembership extends PickType(Membership, ['name', 'quota']) {}
