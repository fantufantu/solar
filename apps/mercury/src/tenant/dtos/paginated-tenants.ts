// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dtos';
import { Tenant } from '../entities/tenant.entity';

@ObjectType()
export class PaginatedTenants extends Paginated(Tenant) {}
