// nest
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
// third
import { Entity, PrimaryColumn, Unique } from 'typeorm';

export enum TargetType {
  AccountBook = 'account-book',
  Transaction = 'transaction',
}

registerEnumType(TargetType, {
  name: 'ShareTargetType',
  description: '共享对象类型',
});

@ObjectType()
@Unique(['targetType', 'targetId', 'sharedById'])
@Entity()
export class Share {
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
