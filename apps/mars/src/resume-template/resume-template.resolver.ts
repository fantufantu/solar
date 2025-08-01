import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplate } from '@/libs/database/entities/mars/resume-template.entity';
import { CreateResumeTemplateInput } from './dto/create-resume-template.input';
import { UpdateResumeTemplateInput } from './dto/update-resume-template.input';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { User } from '@/libs/database/entities/mercury/user.entity';
import { PaginatedResumeTemplates } from './dto/paginated-resume-templates.object';
import { PaginatedInterceptor } from 'assets/interceptors/paginated.interceptor';
import { PaginateBy } from 'assets/dto/paginate-by.input';
import { WhoAmI } from 'utils/decorators/who-am-i.decorator';
import { Pagination } from 'utils/decorators/filter.decorator';

@Resolver(() => ResumeTemplate)
export class ResumeTemplateResolver {
  constructor(private readonly resumeTemplateService: ResumeTemplateService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ResumeTemplate, { description: '创建简历模板' })
  createResumeTemplate(
    @Args('createResumeTemplateInput')
    createResumeTemplateInput: CreateResumeTemplateInput,
    @WhoAmI() who: User,
  ) {
    return this.resumeTemplateService.create(createResumeTemplateInput, who.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '更新简历模板' })
  updateResumeTemplate(
    @Args('code', { type: () => String }) code: string,
    @Args('updateResumeTemplateInput')
    updateResumeTemplateInput: UpdateResumeTemplateInput,
    @WhoAmI() who: User,
  ) {
    return this.resumeTemplateService.update(
      code,
      updateResumeTemplateInput,
      who.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '删除简历模板' })
  removeResumeTemplate(
    @Args('id', { type: () => Int }) id: number,
    @WhoAmI() who: User,
  ) {
    return this.resumeTemplateService.remove(id, who.id);
  }

  @Query(() => PaginatedResumeTemplates, { description: '简历模板列表' })
  @UseInterceptors(PaginatedInterceptor)
  resumeTemplates(@Pagination() paginateBy: PaginateBy) {
    return this.resumeTemplateService.resumeTemplates({ paginateBy });
  }

  @Query(() => ResumeTemplate, { description: '简历模板详情' })
  resumeTemplate(
    @Args('code', { type: () => String, description: '简历模板`code`' })
    code: string,
  ) {
    return this.resumeTemplateService.resumeTemplate(code);
  }
}
