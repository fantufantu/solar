import { UserVerificationType } from '../entities/user-verification.entity';

export class VerifyBy {
  verifiedBy: string;
  type: UserVerificationType;
  captcha: string;
}
