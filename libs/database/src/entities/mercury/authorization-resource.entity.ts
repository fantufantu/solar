import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLEnumToken } from 'assets/tokens';
import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum AuthorizationResourceCode {
  Article = 'article',
  Authorization = 'authorization',
  Dictionary = 'dictionary',
  DictionaryEnum = 'dictionary-enum',
  Role = 'role',
}

registerEnumType(AuthorizationResourceCode, {
  name: GraphQLEnumToken.AuthorizationResourceCode,
  description: '权限资源code',
});

@ObjectType()
@Entity({
  name: 'authorization_resource',
})
export class AuthorizationResource {
  @Field(() => AuthorizationResourceCode, {
    description: '权限资源code',
  })
  @PrimaryColumn({
    type: 'enum',
    enum: AuthorizationResourceCode,
  })
  @IsEnum(AuthorizationResourceCode)
  code: AuthorizationResourceCode;

  @Field(() => String, {
    description: '权限资源名称',
  })
  @Column()
  name: string;
}
