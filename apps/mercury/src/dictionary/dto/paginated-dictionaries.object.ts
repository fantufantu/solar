import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Dictionary } from '@/libs/database/entities/mercury/dictionary.entity';

@ObjectType()
export class PaginatedDictionaries extends Paginated(Dictionary) {}
