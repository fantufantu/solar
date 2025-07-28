import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum AuthorizationActionCode {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  All = '*',
}

registerEnumType(AuthorizationActionCode, {
  name: GraphQLEnumToken.AuthorizationActionCode,
  description: '权限操作code',
});

@ObjectType()
@Entity({
  name: 'authorization_action',
})
export class AuthorizationAction {
  @Field(() => AuthorizationActionCode, {
    description: '权限操作code',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: AuthorizationActionCode,
    name: 'code',
  })
  @IsEnum(AuthorizationActionCode)
  code: AuthorizationActionCode;

  @Field(() => String, {
    description: '权限操作名称',
  })
  @Column({ name: 'name' })
  name: string;
}
