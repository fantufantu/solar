// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { CustomProviderToken } from 'assets/enums';
import type { Pattern } from 'typings/micro-service';

@Injectable()
export class PlutoClientService {
  constructor(
    @Inject(CustomProviderToken.PlutoClientProxy)
    private readonly client: ClientProxy,
  ) {}

  /**
   * sending messages
   */
  async send<T, V = any>(pattern: Pattern, data: V) {
    return await lastValueFrom(this.client.send<T>(pattern, data));
  }
}
