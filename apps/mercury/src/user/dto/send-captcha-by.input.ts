import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserVerificationType } from '@/lib/database/entities/mercury/user-verification.entity';

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
