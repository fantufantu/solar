// nest
import { Field, ObjectType } from '@nestjs/graphql';
// third
import dayjs = require('dayjs');
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum Type {
  Email = 'email',
  Phone = 'phone',
}

@ObjectType()
@Entity()
export class UserVerification {
  @Field(() => String, {
    description: '验证地址',
  })
  @PrimaryColumn()
  verifiedBy: string;

  @Field(() => String, {
    description: '验证类型',
  })
  @PrimaryColumn({
    enum: Type,
  })
  type: Type;

  @Field(() => String, {
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
  sentAt: Date | null;

  loadCaptcha() {
    this.captcha = ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
    this.validTo = dayjs().add(24, 'h').toDate();
  }
}
