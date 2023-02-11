// nest
import { ObjectType, Field, Int } from '@nestjs/graphql';
// third
import { Column, Entity } from 'typeorm';
// project
import { Foundation } from 'assets/entities/foundation.entity';

@ObjectType()
@Entity()
export class Billing extends Foundation {
  @Field(() => String, { description: '账本名称' })
  @Column()
  name: string;

  @Field(() => Int, { description: '账本创建人id' })
  @Column()
  createdById: number;

  @Column({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}
