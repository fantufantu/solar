// nest
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
// third
import dayjs = require('dayjs');
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum UserVerificationType {
  Email = 'email',
  Phone = 'phone',
}

registerEnumType(UserVerificationType, {
  name: GraphQLEnumToken.UserVerificationType,
  description: '用户验证类型',
});

@ObjectType()
@Entity()
export class UserVerification {
  @Field(() => String, {
    description: '验证方式',
  })
  @PrimaryColumn()
  verifiedBy: string;

  @Field(() => String, {
    description: '验证类型',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: UserVerificationType,
  })
  type: UserVerificationType;

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
  })
  sentAt?: Date;

  /**
   * 生成验证码
   */
  reload() {
    this.captcha = `000000${Math.floor(Math.random() * 1000000)}`.slice(-6);
    this.validTo = dayjs().add(24, 'h').toDate();
    return this;
  }
}
