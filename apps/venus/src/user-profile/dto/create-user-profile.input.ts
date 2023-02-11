// project
import { UserProfile } from '../entities/user-profile.entity';

export interface CreateUserProfileInput
  extends Pick<UserProfile, 'userId' | 'defaultBillingId'> {}
