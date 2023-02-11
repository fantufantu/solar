// project
import { User } from '../entities/user.entity';

export interface CreateUserInput
  extends Pick<User, 'id' | 'defaultBillingId'> {}
