// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { AccountBook } from '../entities/account-book.entity';

@InputType()
export class CreateAccountBookInput extends PickType(
  AccountBook,
  ['name'],
  InputType,
) {}
