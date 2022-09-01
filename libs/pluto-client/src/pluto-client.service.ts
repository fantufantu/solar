// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { CustomProviderToken } from 'assets/enums';
import type { Pattern, SendInput } from 'typings/micro-service';

@Injectable()
export class PlutoClientService {
  constructor(
    @Inject(CustomProviderToken.PlutoClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * sending messages
   */
  async send<T, P extends Pattern = Pattern>(
    pattern: Pattern,
    data: SendInput<P>,
  ) {
    return await lastValueFrom(this.client.send<T>(pattern, data));
  }
}
