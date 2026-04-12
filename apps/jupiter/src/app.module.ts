import { Module } from '@nestjs/common';
import { TouristGuideModule } from './tourist-guide/tourist-guide.module';
import { PlutoClientModule } from '@/libs/pluto-client';

@Module({
  imports: [
    // 配置微服务客户端
    PlutoClientModule,
    TouristGuideModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
