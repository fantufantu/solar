// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Billing } from '../entities/billing.entity';

@ObjectType()
export class PaginatedBillings extends Paginated(Billing) {}
