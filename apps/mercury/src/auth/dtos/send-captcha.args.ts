import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class SendCaptchaArgs {
  @Field(() => String, {
    description: '邮箱地址',
  })
  @IsEmail()
  emailAddress: string;
}
