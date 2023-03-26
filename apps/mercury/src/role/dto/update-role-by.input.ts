// nest
import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
// project
import { CreateRoleBy } from './create-role-by.input';

@InputType()
export class UpdateRoleBy extends PartialType(CreateRoleBy) {
  @Field(() => [Int], {
    description: '角色关联的用户id',
    nullable: true,
  })
  userIds?: number[];

  @Field(() => [Int], {
    description: '角色关联的权限id',
    nullable: true,
  })
  authorizationIds?: number[];
}
