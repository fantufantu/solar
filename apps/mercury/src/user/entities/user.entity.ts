// nest
import { BadRequestException } from '@nestjs/common';
import { Directive, Field, ObjectType } from '@nestjs/graphql';
// third
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { hashSync } from 'bcrypt';
import { IsEmail, MaxLength, MinLength, isURL } from 'class-validator';
// project
import { Foundation } from 'assets/entities/foundation.entity';
import { UserEmail } from './user-email.entity';
import { Role } from '../../role/entities/role.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends Foundation {
  @Field(() => String, {
    description: '用户名',
  })
  @Column({
    unique: true,
  })
  @MaxLength(20)
  username: string;

  @OneToOne(() => UserEmail, 'emailAddress', {
    cascade: true,
  })
  @JoinColumn()
  email: UserEmail;

  @Field(() => String, {
    description: '邮箱地址',
  })
  @Column({
    unique: true,
  })
  @IsEmail()
  emailAddress: string;

  @Field(() => String, {
    description: '头像',
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  avatar?: string;

  @Column({
    select: false,
  })
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  roles?: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword() {
    if (!this.password) return;
    this.password = hashSync(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  private validatePassword() {
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
  private validateAvatar() {
    if (!this.avatar) return;
    if (!isURL(this.avatar))
      throw new BadRequestException('avatar must be an URL address');
  }

  @BeforeInsert()
  private generateUsername() {
    if (this.username) return;
    this.username = randomUUID();
  }
}
