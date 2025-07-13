import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';

@ObjectType()
export class PaginatedResumeTemplates extends Paginated(ResumeTemplate) {}
