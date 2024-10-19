import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Billing } from '@/libs/database/entities/venus/billing.entity';

@ObjectType()
export class PaginatedBillings extends Paginated(Billing) {}
