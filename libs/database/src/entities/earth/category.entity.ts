import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  Unique,
} from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { ArticleToCategory } from './article_to_category.entity';

@ObjectType('ArticleCategory')
@Unique(['code'])
@Entity()
export class Category extends Preset {
  @Field(() => String, {
    description: '分类code',
  })
  @Column({ type: 'varchar', length: 40 })
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
  articleToCategory: ArticleToCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateImage() {
    if (!isURL(this.image)) {
      throw new BadRequestException('文章分类的图片不是合法的url！');
    }
  }
}
