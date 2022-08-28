import { Menu } from '@app/data-base/entities/boomemory';
import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'utils/dto';

@ObjectType()
export class PaginatedMenus extends Paginated(Menu) {}
