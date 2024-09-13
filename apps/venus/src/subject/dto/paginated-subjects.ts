// nest
import { ObjectType } from '@nestjs/graphql';
// project
import { Paginated } from 'assets/dto';
import { Subject } from '../entities/subject.entity';

@ObjectType()
export class PaginatedSubjects extends Paginated(Subject) {}
