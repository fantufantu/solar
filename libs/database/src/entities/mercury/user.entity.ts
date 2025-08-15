import { BadRequestException } from '@nestjs/common';
import { Directive, Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { hashSync } from 'bcrypt';
import { IsEmail, MaxLength, MinLength, isURL } from 'class-validator';
import { IdentifiedTimeStamped } from '../any-use/identified-time-stamped.entity';

import { Role } from './role.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends IdentifiedTimeStamped {
  @Field(() => String, {
    description: '用户名',
  })
  @Column({
    type: 'varchar',
    length: 36,
    unique: true,
  })
  @MaxLength(36)
  username: string;

  @Field(() => String, {
    description: '用户昵称',
    nullable: true,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  @MaxLength(20)
  nickname: string | null;

  @Field(() => String, {
    description: '邮箱地址',
  })
  @Column({
    unique: true,
    name: 'email_address',
    type: 'varchar',
    length: 128,
    comment: '邮箱地址',
  })
  @IsEmail()
  emailAddress: string;

  @Field(() => String, {
    description: '头像',
    nullable: true,
  })
  @Column({
    nullable: true,
    type: 'varchar',
    length: 128,
    comment: '头像',
  })
  avatar?: string;

  @Column({
    select: false,
    comment: '密码',
    type: 'varchar',
    length: 60,
  })
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  roles?: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  private _hashPassword() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private _validatePassword() {
    if (!this.password) return;
    if (
      !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/.test(
        this.password,
      )
    )
      throw new BadRequestException(
        '密码必须包含大写字母，小写字母，数据，特殊符号中任意三项！',
      );
  }

  @BeforeInsert()
  @BeforeUpdate()
  private _validateAvatar() {
    if (!this.avatar) return;
    if (!isURL(this.avatar))
      throw new BadRequestException('avatar must be an URL address');
  }

  @BeforeInsert()
  private _generateUsername() {
    if (this.username) return;
    this.username = randomUUID();
  }
}
