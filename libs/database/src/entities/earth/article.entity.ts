import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { isURL } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { ArticleToCategory } from './article_to_category.entity';

@ObjectType()
@Entity()
export class Article extends Preset {
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

  @Column()
  createdById: number;

  @OneToMany(() => ArticleToCategory, (_) => _.article)
  articleToCategory?: ArticleToCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateCover() {
    if (!this.cover) return;
    if (!isURL(this.cover))
      throw new BadRequestException('cover must be an url');
  }
}