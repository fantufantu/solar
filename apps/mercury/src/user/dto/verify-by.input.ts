import { UserVerificationType } from '@/lib/database/entities/mercury/user-verification.entity';

export class VerifyBy {
  verifiedBy: string;
  type: UserVerificationType;
  captcha: string;
}
