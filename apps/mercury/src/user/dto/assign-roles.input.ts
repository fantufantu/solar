import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignRolesInput {
  @Field(() => String, {
    description: '用户`id`',
  })
  userId!: string;

  @Field(() => [String], {
    description: '待分配的角色`code`列表',
  })
  roleCodes: string[];
}
