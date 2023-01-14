// project
import { CreateUserProfileInput } from './create-user-profile.input';

export interface UpdateUserProfileInput
  extends Omit<CreateUserProfileInput, 'userId'> {}
