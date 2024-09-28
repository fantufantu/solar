import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Role } from '@/lib/database/entities/mercury/role.entity';

@ObjectType()
export class PaginatedRole extends Paginated(Role) {}
