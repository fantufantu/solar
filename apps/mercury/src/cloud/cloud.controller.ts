import { Controller, Post, Sse } from '@nestjs/common';
import { CloudService } from './cloud.service';

@Controller()
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Post('/api/chat')
  @Sse()
  chat() {
    return this.cloudService.chat('');
  }
}
