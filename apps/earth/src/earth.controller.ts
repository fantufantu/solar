import { Controller, Get } from '@nestjs/common';
import { EarthService } from './earth.service';

@Controller()
export class EarthController {
  constructor(private readonly earthService: EarthService) {}

  @Get()
  getHello(): string {
    return this.earthService.getHello();
  }
}
