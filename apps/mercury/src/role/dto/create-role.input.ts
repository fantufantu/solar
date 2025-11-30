import { InputType, PickType } from '@nestjs/graphql';
import { Role } from '@/libs/database/entities/mercury/role.entity';

@InputType()
export class CreateRoleInput extends PickType(
  Role,
  ['code', 'name'],
  InputType,
) {}
