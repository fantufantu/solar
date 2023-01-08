import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AccountBookService } from './account-book.service';
import { AccountBook } from './entities/account-book.entity';
import { CreateAccountBookInput } from './dto/create-account-book.input';
import { UpdateAccountBookInput } from './dto/update-account-book.input';

@Resolver(() => AccountBook)
export class AccountBookResolver {
  constructor(private readonly accountBookService: AccountBookService) {}

  @Mutation(() => AccountBook)
  createAccountBook(@Args('createAccountBookInput') createAccountBookInput: CreateAccountBookInput) {
    return this.accountBookService.create(createAccountBookInput);
  }

  @Query(() => [AccountBook], { name: 'accountBook' })
  findAll() {
    return this.accountBookService.findAll();
  }

  @Query(() => AccountBook, { name: 'accountBook' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.accountBookService.findOne(id);
  }

  @Mutation(() => AccountBook)
  updateAccountBook(@Args('updateAccountBookInput') updateAccountBookInput: UpdateAccountBookInput) {
    return this.accountBookService.update(updateAccountBookInput.id, updateAccountBookInput);
  }

  @Mutation(() => AccountBook)
  removeAccountBook(@Args('id', { type: () => Int }) id: number) {
    return this.accountBookService.remove(id);
  }
}
