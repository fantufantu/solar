import { Module } from '@nestjs/common';
import { ResumeModule } from './resume/resume.module';
import { DatabaseModule } from '@/libs/database';
import { ApplicationToken } from 'assets/tokens';

@Module({
  imports: [
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Mars),
    // 简历模块
    ResumeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
