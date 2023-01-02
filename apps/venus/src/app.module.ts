// nest
import { Module } from '@nestjs/common';
// project
import { GraphQLModule } from '@app/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database';
import { ApplicationToken } from 'assets/tokens';
import { PassportModule } from '@app/passport';

@Module({
  imports: [
    // api
    GraphQLModule,
    // 数据库
    DatabaseModule.forRoot(ApplicationToken.Venus),
    // 鉴权
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
