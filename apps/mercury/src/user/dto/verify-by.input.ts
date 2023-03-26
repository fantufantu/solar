import { Type } from '../entities/user-verification.entity';

export class VerifyBy {
  verifiedBy: string;
  type: Type;
  captcha: string;
}
