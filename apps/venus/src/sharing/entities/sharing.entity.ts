// nest
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
// third
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
@Unique(['targetType', 'targetId', 'sharedById'])
@Entity()
export class Sharing {
  @Field(() => TargetType, {
    description: '共享对象类型',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: TargetType,
  })
  targetType: TargetType;

  @Field(() => Int, {
    description: '共享对象id',
  })
  @PrimaryColumn()
  targetId: number;

  @Field(() => Int, {
    description: '共享人员id',
  })
  @PrimaryColumn()
  sharedById: number;
}
