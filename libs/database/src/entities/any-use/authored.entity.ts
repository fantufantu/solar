import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column } from 'typeorm';
import { TimeStamped } from './time-stamped.entity';

@ObjectType()
export class Authored extends TimeStamped {
  @Field(() => Int, {
    description: '创建人`id`',
  })
  @Column({ comment: '创建人`id`', name: 'created_by_id' })
  createdById!: number;

  @Field(() => Int, {
    description: '最后更新人`id`',
  })
  @Column({
    comment: '最后更新人`id`',
    name: 'updated_by_id',
  })
  updatedById!: number;

  /**
   * 新建时默认设置更新人为创建人
   */
  @BeforeInsert()
  private _useUpdatedBy() {
    this.updatedById = this.createdById;
  }
}
