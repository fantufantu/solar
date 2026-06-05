import { ObjectType } from '@nestjs/graphql';
import { DeleteDateColumn } from 'typeorm';
import { Authored } from './authored.entity';

@ObjectType()
export class Tracked extends Authored {
  @DeleteDateColumn({
    comment: '删除时间',
    name: 'deleted_at',
  })
  deletedAt: Date | null = null;

  /**
   * 删除当前实例
   */
  set deletedById(deleteById: number) {
    this.deletedAt = new Date();
    this.updatedById = deleteById;
  }
}
