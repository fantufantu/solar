import { InputType, PickType } from '@nestjs/graphql';
import { User } from '@/lib/database/entities/mercury/user.entity';

@InputType()
export class UpdateUserBy extends PickType(User, ['nickname'], InputType) {}
