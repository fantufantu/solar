import type { ValueOf } from '@aiszlab/relax/types';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';
import { Entity, PrimaryColumn, Unique } from 'typeorm';

export const TARGET_TYPE = {
  billing: 'billing',
  transaction: 'transaction',
} as const;

export type TargetType = ValueOf<typeof TARGET_TYPE>;

registerEnumType(TARGET_TYPE, {
  name: GRAPHQL_ENUM_TOKEN.SHARING_TARGET_TYPE,
  description: '共享对象类型',
});

@ObjectType()
@Unique(['targetType', 'targetId', 'sharedById'])
@Entity()
export class Sharing {
  @Field(() => TARGET_TYPE, {
    description: '共享对象类型',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: TARGET_TYPE,
    name: 'target_type',
  })
  targetType!: TargetType;

  @Field(() => Int, {
    description: '共享对象id',
  })
  @PrimaryColumn({
    name: 'target_id',
  })
  targetId!: number;

  @Field(() => String, {
    description: '共享人员id',
  })
  @PrimaryColumn({
    name: 'shared_by_id',
    type: 'varchar',
    length: 36,
  })
  sharedById!: string;
}
