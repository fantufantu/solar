// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Tenant } from '../entities/tenant.entity';

@ObjectType()
export class PaginatedTenants extends Paginated(Tenant) {}
