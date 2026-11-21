import { CreateResumeTemplateInput } from './create-resume-template.input.js';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResumeTemplateInput extends PartialType(
  CreateResumeTemplateInput,
) {}
