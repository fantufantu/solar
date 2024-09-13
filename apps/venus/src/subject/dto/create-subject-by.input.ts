// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Subject } from '../entities/subject.entity';

@InputType()
export class CreateSubjectBy extends PickType(
  Subject,
  ['name', 'direction'],
  InputType,
) {}
