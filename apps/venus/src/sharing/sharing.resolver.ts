import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SharingService } from './sharing.service';
import { Sharing } from '@/libs/database/entities/venus/sharing.entity';
import { CreateSharingBy } from './dto/create-sharing-by.input';
import { SharingLoader } from './sharing.loader';
import { RemoveSharingBy } from './dto/remove-sharing-by.input';
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
  createSharing(@Args('createBy') createSharingBy: CreateSharingBy) {
    return this.sharingService.create(createSharingBy);
  }

  @Mutation(() => Boolean, {
    description: '删除分享',
  })
  removeSharing(@Args('removeBy') removeBy: RemoveSharingBy) {
    return this.sharingService.remove(removeBy);
  }

  @ResolveField('sharedBy', () => User, {
    description: '分享人员',
    nullable: true,
  })
  getSharedBy(@Parent() sharing: Sharing) {
    return this.sharingLoader.getUserById.load(sharing.sharedById);
  }
}
