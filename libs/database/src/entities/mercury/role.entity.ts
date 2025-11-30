import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';

/**
 * 内置角色
 */
export const ROLES = {
  // 管理员
  ADMIN: 'admin',
  // 游客
  GUEST: 'guest',
};

@Entity({
  name: 'role',
})
@ObjectType()
export class Role extends TimeStamped {
  @Field(() => String, { description: '角色`code`' })
  @PrimaryColumn({
    comment: '角色`code`',
    type: 'varchar',
    length: 20,
  })
  code: string;

  @Field(() => String, { description: '角色名称' })
  @Column({
    comment: '角色名称',
    type: 'varchar',
    length: 40,
  })
  name: string;
}
