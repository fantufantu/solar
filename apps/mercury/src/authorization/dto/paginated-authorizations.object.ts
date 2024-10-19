import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Authorization } from '@/libs/database/entities/mercury/authorization.entity';

@ObjectType()
export class PaginatedAuthorizations extends Paginated(Authorization) {}
