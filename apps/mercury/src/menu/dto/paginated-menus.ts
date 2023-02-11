// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Menu } from '../entities/menu.entity';

@ObjectType()
export class PaginatedMenus extends Paginated(Menu) {}
