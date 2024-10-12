import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SendCaptchaBy {
  @Field(() => String, {
    description: '验证地址',
  })
  @IsEmail()
  to: string;
}
