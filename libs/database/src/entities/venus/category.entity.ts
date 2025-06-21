import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Preset } from '../any-use/preset.entity';
import { Direction } from 'assets/entities/direction.transaction.enum';

@ObjectType('TransactionCategory')
@Entity()
export class Category extends Preset {
  @Field(() => String, { description: '名称' })
  @Column()
  name: string;

  @Field(() => Direction, {
    description: '交易方向',
  })
  @Column({
    type: 'enum',
    enum: Direction,
  })
  direction: Direction;
}
