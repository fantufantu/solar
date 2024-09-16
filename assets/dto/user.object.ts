import { Field, ObjectType } from '@nestjs/graphql';
import {} from '@/lib/database/entities/mercury/user.entity';

@ObjectType()
export class User {
  @Field(() => String, {
    description: '用户名',
    nullable: true,
  })
  username: string | null;

  @Field(() => String, {
    description: '用户昵称',
    nullable: true,
  })
  nickname: string | null;

  @Field(() => String, {
    description: '邮箱地址',
    nullable: true,
  })
  emailAddress: string | null;

  @Field(() => String, {
    description: '头像',
    nullable: true,
  })
  avatar: string | null;
}
