// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserBy extends PickType(User, ['nickname'], InputType) {}
