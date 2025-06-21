import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeSoftRemove,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { Preset } from './preset.entity';

@ObjectType()
export class Crud extends Preset {
  @Field(() => Int, {
    description: '创建人id',
  })
  @Column({ comment: '创建人id', name: 'created_by_id' })
  createdById: number;

  @Field(() => Int, {
    description: '最后更新人id',
  })
  @Column({
    comment: '最后更新人id',
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
  useDelete(deleteById: number) {
    return {
      deletedAt: 'NOW()',
      updatedById: deleteById,
    };
  }
}
