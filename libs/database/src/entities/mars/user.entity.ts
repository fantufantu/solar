import { Directive, Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends OmitType(TimeStamped, ['createdAt', 'updatedAt']) {
  @Field(() => Int, {
    description: '用户`id`',
  })
  @PrimaryColumn({
    comment: '用户`id`',
  })
  id: number;

  @Field(() => [String], {
    nullable: true,
    description: '收藏的简历模板`code`列表',
  })
  @Column({
    nullable: true,
    name: 'starred_resume_template_codes',
    type: 'simple-array',
    comment: '收藏的简历模板`code`列表',
  })
  starredResumeTemplateCodes?: string[] | null;
}
