import { Directive, Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TimeStamped } from '../any-use/time-stamped.entity';
import { Membership } from '@/libs/database/entities/jupiter/membership.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User extends OmitType(
  TimeStamped,
  ['createdAt', 'updatedAt'],
  ObjectType,
) {
  @Field(() => Int, {
    description: '用户`id`',
  })
  @PrimaryColumn({
    comment: '用户`id`',
  })
  id!: number;

  @Field(() => Int, {
    nullable: true,
    description: '会员等级`id`，`null`表示免费用户',
  })
  @Column({
    nullable: true,
    name: 'membership_id',
    type: 'int',
    comment: '会员等级`id`',
  })
  membershipId: number | null = null;

  @Field(() => Membership, {
    nullable: true,
    description: '会员等级',
  })
  @ManyToOne(() => Membership, {
    nullable: true,
  })
  @JoinColumn({
    name: 'membership_id',
    referencedColumnName: 'id',
  })
  membership: Membership | null = null;
}
