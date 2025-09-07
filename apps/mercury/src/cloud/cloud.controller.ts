import { Controller } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { CommandToken } from 'assets/tokens';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @MessagePattern({ cmd: CommandToken.GetCredential })
  async credential() {
    return await this.cloudService.credential();
  }
}
