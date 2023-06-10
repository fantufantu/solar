// nest
import { ObjectType, Field } from '@nestjs/graphql';
// third
import { Column, Entity } from 'typeorm';
// project
import { Foundation } from 'assets/entities/foundation.entity';
import { Direction } from 'assets/entities/direction.transaction.enum';

@ObjectType()
@Entity()
export class Category extends Foundation {
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
