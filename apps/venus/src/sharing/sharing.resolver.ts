// nest
import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
// project
import { SharingService } from './sharing.service';
import { Sharing } from './entities/sharing.entity';
import { CreateSharingInput } from './dto/create-sharing.input';
import { SharingLoader } from './sharing.loader';
import { RemoveSharingInput } from './dto/remove-sharing.input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Sharing)
export class SharingResolver {
  constructor(
    private readonly sharingService: SharingService,
    private readonly sharingLoader: SharingLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '创建分享',
  })
  createSharing(
    @Args('createSharingInput') createSharingInput: CreateSharingInput,
  ) {
    return this.sharingService.create(createSharingInput);
  }

  @Mutation(() => Boolean, {
    description: '删除分享',
  })
  removeSharing(
    @Args('removeSharingInput') removeSharingInput: RemoveSharingInput,
  ) {
    return this.sharingService.remove(removeSharingInput);
  }

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
    nullable: true,
  })
  getSharedBy(@Parent() sharing: Sharing) {
    return this.sharingLoader.getUserById.load(sharing.sharedById);
  }
}
