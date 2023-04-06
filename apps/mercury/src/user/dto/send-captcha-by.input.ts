// nest
import { Field, InputType } from '@nestjs/graphql';
// third
import { IsEmail } from 'class-validator';
import { UserVerificationType } from '../entities/user-verification.entity';

@InputType()
export class SendCaptchaBy {
  @Field(() => String, {
    description: '验证地址',
  })
  @IsEmail()
  to: string;

  @Field(() => UserVerificationType, {
    description: '验证方式',
  })
  type: UserVerificationType;
}
