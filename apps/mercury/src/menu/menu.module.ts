// nest
import { Module } from '@nestjs/common';
// project
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';

@Module({
  providers: [MenuResolver, MenuService],
})
export class MenuModule {}
