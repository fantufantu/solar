// nest
import { Module } from '@nestjs/common';
// project
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@app/graphql';
import { PlutoClientModule } from '@app/pluto-client';

@Module({
  imports: [
    // 微服务pluto对应的配置模块
    PlutoClientModule,
    // GraphQL 模块
    GraphQLModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
