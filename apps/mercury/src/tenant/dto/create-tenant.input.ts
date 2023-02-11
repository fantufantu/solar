// nest
import { InputType, PickType } from '@nestjs/graphql';
// project
import { Tenant } from '../entities/tenant.entity';

@InputType()
export class CreateTenantInput extends PickType(
  Tenant,
  ['code', 'name'],
  InputType,
) {}
