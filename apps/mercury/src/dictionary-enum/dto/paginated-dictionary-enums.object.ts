import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';

@ObjectType()
export class PaginatedDictionaryEnum extends Paginated(DictionaryEnum) {}
