import { CreateResumeInput } from './create-resume.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResumeInput extends PartialType(CreateResumeInput) {}
