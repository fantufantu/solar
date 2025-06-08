import { ObjectType, Field } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';

@ObjectType()
@Entity()
export class Resume extends Preset {
  @Field(() => String, {
    description: '标题',
  })
  @Column()
  title: string;

  @Field(() => String, {
    description: '正文',
  })
  @Column('longtext')
  content: string;

  @Field(() => String, { nullable: true, description: '封面地址' })
  @Column({ nullable: true })
  cover?: string;

  @Column({ comment: '作者id' })
  createdById: number;

  @Column({
    comment: '最后更新人id',
  })
  updatedById: number;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
