import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Article } from './article.entity';
import { ArticleToCategory } from './article_to_category.entity';

@ObjectType()
@Entity()
export class Category extends Preset {
  @Field(() => String, {
    description: '分类code',
  })
  @Column()
  @IsString()
  @MaxLength(40)
  code: string;

  @Field(() => String, {
    description: '名称',
  })
  @Column()
  @IsString()
  @MaxLength(20)
  name: string;

  @Field(() => String, {
    description: '图片地址',
  })
  @Column()
  image: string;

  @OneToMany(() => ArticleToCategory, (_) => _.category)
  public articleToCategory: ArticleToCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateImage() {
    if (this.image) return;
    if (!isURL(this.image)) throw new BadRequestException('');
  }
}
