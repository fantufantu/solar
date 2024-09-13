import { BadRequestException } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';
import { isURL } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Preset } from 'assets/entities/preset.entity';
import { Category } from '../../category/entities/category.entity';

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

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable({
    joinColumn: {
      name: 'article',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category',
      referencedColumnName: 'code',
    },
  })
  categories: Category[];

  @BeforeInsert()
  @BeforeUpdate()
  private _validateCover() {
    if (!this.cover) return;
    if (!isURL(this.cover))
      throw new BadRequestException('cover must be an url');
  }
}
