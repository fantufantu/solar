import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { CreateResumeInput } from './dto/create-resume.input';
import { UpdateResumeInput } from './dto/update-resume.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { Paginated } from 'assets/dto/paginated.factory';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { PaginationArgs } from 'utils/decorators/pagination.decorator';
import { Pagination } from 'assets/dto/pagination.input';
import { PaginatedResumes } from './dto/paginated-resumes.object';

@Resolver(() => Resume)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Resume, { description: '创建简历' })
  createResume(@Args('input') input: CreateResumeInput, @WhoAmI() who: User) {
    return this.resumeService.create(input, who);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '更新简历' })
  updateResume(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateResumeInput,
    @WhoAmI() who: User,
  ) {
    return this.resumeService.update(id, input, who);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '删除简历' })
  removeResume(
    @Args('id', { type: () => Int }) id: number,
    @WhoAmI() who: User,
  ) {
    return this.resumeService.remove(id, who);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Resume, { description: '查询简历' })
  resume(@Args('id', { type: () => String }) id: string, @WhoAmI() who: User) {
    return this.resumeService.resume(id, who);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedResumes, {
    description: '查询简历列表',
  })
  @UseInterceptors(PaginatedInterceptor)
  resumes(@WhoAmI() who: User, @PaginationArgs() pagination: Pagination) {
    return this.resumeService.resumes(who.id, pagination);
  }
}
