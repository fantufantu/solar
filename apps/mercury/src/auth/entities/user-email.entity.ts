// nest
import { Field, Int, ObjectType } from '@nestjs/graphql';
// third
import dayjs = require('dayjs');
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class UserEmail {
  @Field(() => String, {
    description: '地址',
  })
  @PrimaryColumn()
  address: string;

  @Field(() => Int, {
    description: '验证码',
  })
  @Column({
    length: 6,
  })
  captcha: string;

  @Field(() => Date, {
    description: '有效截止时间',
  })
  @Column()
  validTo: Date;

  @Field(() => Boolean, {
    description: '是否验证',
  })
  @Column({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  sentAt: Date;

  @BeforeInsert()
  generateCaptcha() {
    this.captcha = ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    this.validTo = dayjs().add(24, 'h').toDate();
  }
}
