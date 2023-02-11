// project
import { CreateUserInput } from './create-user.input';

export interface UpdateUserInput extends Omit<CreateUserInput, 'id'> {}
