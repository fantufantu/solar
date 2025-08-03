import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SharingService } from './sharing.service';
import { Sharing } from '@/libs/database/entities/venus/sharing.entity';
import { CreateSharingInput } from './dto/create-sharing.input';
import { SharingLoader } from './sharing.loader';
import { RemoveSharingInput } from './dto/remove-sharing.input';
import { User } from '@/libs/database/entities/venus/user.entity';

@Resolver(() => Sharing)
export class SharingResolver {
  constructor(
    private readonly sharingService: SharingService,
    private readonly sharingLoader: SharingLoader,
  ) {}

  @Mutation(() => Boolean, {
    description: '创建分享',
  })
  createSharing(@Args('input') input: CreateSharingInput) {
    return this.sharingService.create(input);
  }

  @Mutation(() => Boolean, {
    description: '删除分享',
  })
  removeSharing(@Args('input') input: RemoveSharingInput) {
    return this.sharingService.remove(input);
  }

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
    nullable: true,
  })
  getSharedBy(@Parent() sharing: Sharing) {
    return this.sharingLoader.getUserById.load(sharing.sharedById);
  }
}
