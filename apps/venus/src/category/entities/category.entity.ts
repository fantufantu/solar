// nest
import { ObjectType, Field } from '@nestjs/graphql';
// third
import { Column, Entity } from 'typeorm';
// project
import { Foundation } from 'assets/entities/foundation.entity';

@ObjectType()
@Entity()
export class Category extends Foundation {
  @Field(() => String, { description: '名称' })
  @Column()
  name: string;

  @Field(() => String, { description: '图标' })
  @Column()
  icon: string;
}
