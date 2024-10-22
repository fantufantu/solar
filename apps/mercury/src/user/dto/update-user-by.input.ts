import { InputType, PickType } from '@nestjs/graphql';
import { User } from '@/libs/database/entities/mercury/user.entity';

@InputType()
export class UpdateUserBy extends PickType(
  User,
  ['nickname', 'avatar'],
  InputType,
) {}
