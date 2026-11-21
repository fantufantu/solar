import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from './create-role.input';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => [String], {
    description: '角色关联的用户id',
    nullable: true,
  })
  userIds?: string[];

  @Field(() => [Int], {
    description: '角色关联的权限id',
    nullable: true,
  })
  authorizationIds?: number[];
}
