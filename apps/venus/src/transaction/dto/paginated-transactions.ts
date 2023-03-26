// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Transaction } from '../entities/transaction.entity';

@ObjectType()
export class PaginatedTransactions extends Paginated(Transaction) {}
