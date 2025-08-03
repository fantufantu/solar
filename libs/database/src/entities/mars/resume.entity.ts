import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './resume-template.entity';
import { Tracked } from '../any-use/tracked.entity';

@ObjectType()
@Entity({ comment: '简历' })
export class Resume extends Tracked {
  @Field(() => String, {
    description: '简历`id`',
  })
  @PrimaryGeneratedColumn('uuid', {
    comment: '简历`id`',
    name: 'id',
  })
  id: string;

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

  @Field(() => String, {
    description: '默认简历模板`code`',
  })
  @Column({
    name: 'default_template_code',
    comment: '默认简历模板`code`',
    type: 'varchar',
    length: 40,
  })
  defaultTemplateCode: string;

  @Field(() => ResumeTemplate, {
    description: '默认简历模板',
  })
  @ManyToOne(() => ResumeTemplate)
  @JoinColumn({ referencedColumnName: 'code', name: 'default_template_code' })
  defaultTemplate: ResumeTemplate;
}
