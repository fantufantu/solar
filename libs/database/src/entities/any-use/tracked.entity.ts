import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, DeleteDateColumn } from 'typeorm';
import { TimeStamped } from './time-stamped.entity';

@ObjectType()
export class Tracked extends TimeStamped {
  @Field(() => Int, {
    description: '创建人`id`',
  })
  @Column({ comment: '创建人`id`', name: 'created_by_id' })
  createdById: number;

  @Field(() => Int, {
    description: '最后更新人`id`',
  })
  @Column({
    comment: '最后更新人`id`',
    name: 'updated_by_id',
  })
  updatedById: number;

  @DeleteDateColumn({
    comment: '删除时间',
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  /**
   * 新建时默认设置更新人为创建人
   */
  @BeforeInsert()
  private _useUpdatedBy() {
    this.updatedById = this.createdById;
  }

  /**
   * 删除当前实例
   */
  set deletedById(deleteById: number) {
    this.deletedAt = new Date();
    this.updatedById = deleteById;
  }
}
