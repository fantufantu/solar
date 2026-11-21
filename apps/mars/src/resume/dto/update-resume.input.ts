import { CreateResumeInput } from './create-resume.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResumeInput extends PartialType(CreateResumeInput) {}
