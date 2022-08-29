// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dtos';
import { Role } from '../entities/role.entity';

@ObjectType()
export class PaginatedRole extends Paginated(Role) {}
