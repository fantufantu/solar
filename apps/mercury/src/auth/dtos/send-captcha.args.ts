// nest
import { ArgsType, Field } from '@nestjs/graphql';
// third
import { IsEmail } from 'class-validator';

@ArgsType()
export class SendCaptchaArgs {
  @Field(() => String, {
    description: '邮箱地址',
  })
  @IsEmail()
  emailAddress: string;
}
