import { Resolver } from '@nestjs/graphql';
import { TenantService } from './tenant.service';

@Resolver()
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}
}
