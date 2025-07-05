import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Resume {
  @Field(() => String, {
    description: 'id',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, {
    description: '简历名称',
  })
  @Column()
  name: string;

  @Field(() => String, {
    description: '简历正文',
  })
  @Column('longtext')
  content: string;

  // copied from `Preset` Entity
  @Field(() => Date, {
    description: '创建时间',
  })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: '更新时间',
  })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  // copied from `Crud` Entity
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
