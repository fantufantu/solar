import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Crud } from '../any-use/crud.entity';

@ObjectType()
@Entity()
export class Resume extends Crud {
  @Field(() => String, {
    description: '简历名称',
  })
  @Column()
  name: string;

  @Field(() => String, {
    description: '简历正文',
  })
  @Column('longtext')
  content: string;
}
