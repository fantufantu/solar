// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateMenuInput } from './create-menu.input';

@InputType()
export class UpdateMenuInput extends PartialType(CreateMenuInput) {}
