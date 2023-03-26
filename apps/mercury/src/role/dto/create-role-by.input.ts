// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Role } from '../entities/role.entity';

@InputType()
export class CreateRoleBy extends PickType(Role, ['name'], InputType) {}
