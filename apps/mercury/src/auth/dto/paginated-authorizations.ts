// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Authorization } from '../entities/authorization.entity';

@ObjectType()
export class PaginatedAuthorizations extends Paginated(Authorization) {}
