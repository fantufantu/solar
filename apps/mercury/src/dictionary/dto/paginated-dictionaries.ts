// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Dictionary } from '../entities/dictionary.entity';

@ObjectType()
export class PaginatedDictionaries extends Paginated(Dictionary) {}
