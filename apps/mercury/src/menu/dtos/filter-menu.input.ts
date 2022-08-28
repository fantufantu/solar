import { Field, InputType, Int } from '@nestjs/graphql';
import { FindOperator } from 'typeorm';

@InputType()
export class FilterMenuInput {
  @Field(() => Int, { nullable: true, description: '上级菜单id' })
  parentId?: number;

  @Field(() => String, { nullable: true, description: '租户Code' })
  tenantCode?: string;

  id?: FindOperator<number>;
}
