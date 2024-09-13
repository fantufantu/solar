import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, isURL, MaxLength } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
} from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Article } from '../../article/entities/article.entity';

@ObjectType()
@Entity()
export class Category extends Preset {
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

  @ManyToMany(() => Article, (article) => article.categories)
  articles: Article[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateImage() {
    if (this.image) return;
    if (!isURL(this.image)) throw new BadRequestException('');
  }
}
