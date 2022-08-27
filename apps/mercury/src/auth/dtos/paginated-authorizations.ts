import { Authorization } from '@app/data-base/entities/boomemory';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedAuthorizations extends Paginated(Authorization) {}
