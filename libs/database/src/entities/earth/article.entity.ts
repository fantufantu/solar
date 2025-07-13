import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { isURL } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { ArticleWithCategory } from './article-with-category.entity';
import { Crud } from '../any-use/crud.entity';

@ObjectType()
@Entity()
export class Article extends Crud {
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
