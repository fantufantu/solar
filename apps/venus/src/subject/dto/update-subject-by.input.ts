// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateSubjectBy } from './create-subject-by.input';

@InputType()
export class UpdateSubjectBy extends PartialType(CreateSubjectBy) {}
