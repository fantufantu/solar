import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Crud } from '../any-use/crud.entity';

@ObjectType()
@Entity({ comment: '简历' })
export class Resume extends Crud {
  @Field(() => String, {
    description: '简历名称',
  })
  @Column({
    type: 'varchar',
    length: 40,
    comment: '简历名称',
  })
  name: string;

  @Field(() => String, {
    description: '简历正文',
  })
  @Column({
    type: 'longtext',
    comment: '简历正文',
  })
  content: string;
}
