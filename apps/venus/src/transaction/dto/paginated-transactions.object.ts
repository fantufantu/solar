import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Transaction } from '@/libs/database/entities/venus/transaction.entity';

@ObjectType()
export class PaginatedTransactions extends Paginated(Transaction) {}
