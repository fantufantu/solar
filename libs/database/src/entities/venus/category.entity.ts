import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';
import { Direction } from 'assets/entities/direction.transaction.enum';

@ObjectType('TransactionCategory')
@Entity()
export class Category extends IdentifiedTimeStamped {
  @Field(() => String, { description: '名称' })
  @Column({
    type: 'varchar',
    length: 100,
    comment: '名称',
  })
  name: string;

  @Field(() => Direction, {
    description: '交易方向',
  })
  @Column({
    type: 'enum',
    enum: Direction,
    comment: '交易方向',
  })
  direction: Direction;
}
