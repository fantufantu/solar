import { User } from '@/libs/database/entities/mercury/user.entity';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}
