import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ResumeService } from './resume.service';
import { Resume } from '@/libs/database/entities/mars/resume.entity';
import { CreateResumeInput } from './dto/create-resume.input';
import { UpdateResumeInput } from './dto/update-resume.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/libs/passport/guards';
import { WhoAmI } from 'assets/decorators';
import { User } from '@/libs/database/entities/mercury/user.entity';

@Resolver(() => Resume)
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Resume, { description: '创建简历' })
  createResume(
    @Args('createResumeInput') createResumeInput: CreateResumeInput,
    @WhoAmI() who: User,
  ) {
    return this.resumeService.create(createResumeInput, who);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { description: '更新简历' })
  updateResume(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateResumeInput') updateResumeInput: UpdateResumeInput,
    @WhoAmI() who: User,
  ) {
    return this.resumeService.update(id, updateResumeInput, who);
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
  @Query(() => Resume, { description: '查询简历', name: 'resume' })
  resume(@Args('id', { type: () => Int }) id: number, @WhoAmI() who: User) {
    return this.resumeService.resume(id, who);
  }
}
