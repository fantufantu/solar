// nest
import { Inject, Injectable } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
// third
import { lastValueFrom } from 'rxjs';
// project
import { MicroServiceClientIdentity } from 'assets/enums';
import type { Pattern } from 'typings/micro-service';

@Injectable()
export class PlutoClientService {
  constructor(
    @Inject(MicroServiceClientIdentity.Pluto)
    private readonly client: ClientProxy,
  ) {}

  /**
   * sending messages
   */
  async send<T>(pattern: Pattern, data: any) {
    return await lastValueFrom(this.client.send<T>(pattern, data));
  }
}
