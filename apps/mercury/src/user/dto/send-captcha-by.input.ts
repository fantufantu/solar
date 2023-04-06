// nest
import { Field, InputType } from '@nestjs/graphql';
// third
import { IsEmail } from 'class-validator';
import { Type } from '../entities/user-verification.entity';

@InputType()
export class SendCaptchaBy {
  @Field(() => String, {
    description: '验证地址',
  })
  @IsEmail()
  to: string;

  @Field(() => Type, {
    description: '验证方式',
  })
  type: Type;
}
