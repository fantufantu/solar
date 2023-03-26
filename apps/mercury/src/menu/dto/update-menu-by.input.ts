// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateMenuBy } from './create-menu-by.input';

@InputType()
export class UpdateMenuBy extends PartialType(CreateMenuBy) {}
