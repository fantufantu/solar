// nest
import { ObjectType, Field, Int } from '@nestjs/graphql';
// third
import { IsString, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
// project
import { AuthorizationResource } from '../../auth/entities/authorization-resource.entity';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { Preset } from 'assets/entities/preset.entity';

@ObjectType()
@Entity()
export class Menu extends Preset {
  @Field(() => String, { description: '名称' })
  @Column()
  @IsString()
  @MaxLength(10)
  name: string;

  @Field(() => Int, { description: '排序码' })
  @Column()
  sortBy: number;

  @Field(() => String, { nullable: true, description: '图标名称' })
  @Column({
    nullable: true,
  })
  icon?: string;

  @Field(() => String, { nullable: true, description: '路由' })
  @Column({
    nullable: true,
  })
  to?: string;

  @Field(() => String, { nullable: true, description: '前端组件' })
  @Column({
    nullable: true,
  })
  component?: string;

  @Field(() => String, { description: '所属租户code' })
  @Column()
  tenantCode: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.menus)
  tenant: Tenant;

  @Field(() => Int, { nullable: true, description: '上级菜单id' })
  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Menu, (menu) => menu.children)
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];

  @ManyToMany(() => AuthorizationResource)
  @JoinTable()
  resources: AuthorizationResource[];
}
