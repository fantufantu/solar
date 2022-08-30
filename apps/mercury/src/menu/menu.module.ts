// nest
import { Module } from '@nestjs/common';
// project
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { RoleModule } from '../role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuLoader } from './menu.loader';

@Module({
  imports: [RoleModule, TypeOrmModule.forFeature([Menu])],
  providers: [MenuResolver, MenuLoader, MenuService],
  exports: [MenuService],
})
export class MenuModule {}
