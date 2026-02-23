import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AssignRolesInput {
  @Field(() => Int, {
    description: '用户`id`',
  })
  userId: number;

  @Field(() => [String], {
    description: '待分配的角色`code`列表',
  })
  roleCodes: string[];
}
