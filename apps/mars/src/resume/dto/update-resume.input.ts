import { CreateResumeInput } from './create-resume.input.js';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResumeInput extends PartialType(CreateResumeInput) {}
