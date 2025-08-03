import { ObjectType } from '@nestjs/graphql';
import { Paginated } from 'assets/dto/paginated.factory';
import { Resume } from '@/libs/database/entities/mars/resume.entity';

@ObjectType()
export class PaginatedResumes extends Paginated(Resume) {}
