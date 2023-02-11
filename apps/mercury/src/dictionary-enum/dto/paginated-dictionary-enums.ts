// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { DictionaryEnum } from '../entities/dictionary-enum.entity';

@ObjectType()
export class PaginatedDictionaryEnum extends Paginated(DictionaryEnum) {}
