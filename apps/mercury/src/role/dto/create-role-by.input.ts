import { InputType, PickType } from '@nestjs/graphql';
import { Role } from '@/libs/database/entities/mercury/role.entity';

@InputType()
export class CreateRoleBy extends PickType(Role, ['name'], InputType) {}
