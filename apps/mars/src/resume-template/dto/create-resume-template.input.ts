import { InputType, PickType } from '@nestjs/graphql';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';

@InputType()
export class CreateResumeTemplateInput extends PickType(
  ResumeTemplate,
  ['code', 'name', 'cover', 'tags', 'description'],
  InputType,
) {}
