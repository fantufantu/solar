import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { isURL } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { ArticleWithCategory } from './article-with-category.entity';
import { IdentifiedTracked } from '../any-use/identified-tracked.entity';

@ObjectType()
@Entity()
export class Article extends IdentifiedTracked {
  @Field(() => String, {
    description: '标题',
  })
  @Column({
    comment: '标题',
    type: 'varchar',
    length: 40,
  })
  title: string;

  @Field(() => String, {
    description: '正文',
  })
  @Column({
    type: 'longtext',
    comment: '正文',
  })
  content: string;

  @Field(() => String, { nullable: true, description: '封面' })
  @Column({ nullable: true, comment: '封面', type: 'varchar', length: 128 })
  cover?: string;

  @OneToMany(() => ArticleWithCategory, (_) => _.article)
  articleWithCategory?: ArticleWithCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateCover() {
    if (!this.cover) return;
    if (!isURL(this.cover))
      throw new BadRequestException('cover must be an url');
  }
}
