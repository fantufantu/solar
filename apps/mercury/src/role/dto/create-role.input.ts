// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Role } from '../entities/role.entity';

@InputType()
export class CreateRoleInput extends PickType(Role, ['name'], InputType) {}
