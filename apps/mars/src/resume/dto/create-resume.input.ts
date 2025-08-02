import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class CreateResumeInput extends PickType(
  Resume,
  ['name', 'content', 'defaultTemplateCode'],
  InputType,
) {}
