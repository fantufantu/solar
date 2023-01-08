import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ShareService } from './share.service';
import { Share } from './entities/share.entity';
import { CreateShareInput } from './dto/create-share.input';
import { UpdateShareInput } from './dto/update-share.input';

@Resolver(() => Share)
export class ShareResolver {
  constructor(private readonly shareService: ShareService) {}

  @Mutation(() => Share)
  createShare(@Args('createShareInput') createShareInput: CreateShareInput) {
    return this.shareService.create(createShareInput);
  }

  @Query(() => [Share], { name: 'share' })
  findAll() {
    return this.shareService.findAll();
  }

  @Query(() => Share, { name: 'share' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.shareService.findOne(id);
  }

  @Mutation(() => Share)
  updateShare(@Args('updateShareInput') updateShareInput: UpdateShareInput) {
    return this.shareService.update(updateShareInput.id, updateShareInput);
  }

  @Mutation(() => Share)
  removeShare(@Args('id', { type: () => Int }) id: number) {
    return this.shareService.remove(id);
  }
}
