import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';

@ObjectType()
@Entity()
export class Resume extends Preset {
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

  @Field(() => Int, {
    description: '创建人',
  })
  @Column({ type: 'int2' })
  createdBy: number;

  @Field(() => Int, {
    description: '更新人',
  })
  @Column({ type: 'int2' })
  updatedBy: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
