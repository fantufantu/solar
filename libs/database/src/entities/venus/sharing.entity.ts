import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
import { Entity, PrimaryColumn, Unique } from 'typeorm';

export enum TargetType {
  Billing = 'billing',
  Transaction = 'transaction',
}

registerEnumType(TargetType, {
  name: GraphQLEnumToken.SharingTargetType,
  description: '共享对象类型',
});

@ObjectType()
@Unique(['target_type', 'target_id', 'shared_by_id'])
@Entity()
export class Sharing {
  @Field(() => TargetType, {
    description: '共享对象类型',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: TargetType,
    name: 'target_type',
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '共享对象id',
  })
  @PrimaryColumn({
    name: 'target_id',
  })
  targetId: number;

  @Field(() => Int, {
    description: '共享人员id',
  })
  @PrimaryColumn({
    name: 'shared_by_id',
  })
  sharedById: number;
}
