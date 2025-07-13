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
import { Preset } from '../any-use/preset.entity';
import { ArticleWithCategory } from './article-with-category.entity';
import { isUndefined } from '@aiszlab/relax';

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

  @OneToMany(() => ArticleWithCategory, (_) => _.category)
  articleWithCategory: ArticleWithCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateImage() {
    // 更新时，存在不更新 `image` 的情况
    // 值不存在时，不处理校验
    if (isUndefined(this.image)) return;

    if (!isURL(this.image)) {
      throw new BadRequestException('文章分类的图片不是合法的url！');
    }
  }
}
