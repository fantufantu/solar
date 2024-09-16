import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Transaction } from '@/lib/database/entities/venus/transaction.entity';

@ObjectType()
export class PaginatedTransactions extends Paginated(Transaction) {}
