// nest
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
// third
import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum AuthorizationActionCode {
  Create = 'create',
  Retrieve = 'retrieve',
  Update = 'update',
  Delete = 'delete',
}

registerEnumType(AuthorizationActionCode, {
  name: GraphQLEnumToken.AuthorizationActionCode,
  description: '权限操作code',
});

@ObjectType()
@Entity()
export class AuthorizationAction {
  @Field(() => AuthorizationActionCode, {
    description: '权限操作code',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: AuthorizationActionCode,
  })
  @IsEnum(AuthorizationActionCode)
  code: AuthorizationActionCode;

  @Field(() => String, {
    description: '权限操作名称',
  })
  @Column()
  name: string;
}
