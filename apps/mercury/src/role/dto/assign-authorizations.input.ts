import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AssignAuthorizationsInput {
  @Field(() => String, {
    description: '角色`code`',
  })
  roleCode: string;

  @Field(() => [Int], {
    description: '权限`id`列表',
  })
  authorizationIds: number[];
}
