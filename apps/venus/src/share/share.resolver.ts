// nest
import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// project
import { ShareService } from './share.service';
import { Share } from './entities/share.entity';
import { CreateShareInput } from './dto/create-share.input';
import { ShareLoader } from './share.loader';
import { User } from 'apps/mercury/src/auth/entities/user.entity';
import { RemoveShareInput } from './dto/remove-share.input';

@Resolver(() => Share)
export class ShareResolver {
  constructor(
    private readonly shareService: ShareService,
    private readonly shareLoader: ShareLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '创建分享',
  })
  createShare(@Args('createShareInput') createShareInput: CreateShareInput) {
    return this.shareService.create(createShareInput);
  }

  @Mutation(() => Boolean, {
    description: '删除分享',
  })
  removeShare(@Args('removeShareInput') removeShareInput: RemoveShareInput) {
    return this.shareService.remove(removeShareInput);
  }

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
    nullable: true,
  })
  getSharedBy(@Parent() share: Share) {
    return this.shareLoader.getUserById.load(share.sharedById);
  }
}
