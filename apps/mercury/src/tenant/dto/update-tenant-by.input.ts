// nest
import { InputType, PartialType } from '@nestjs/graphql';
// project
import { CreateTenantBy } from './create-tenant-by.input';

@InputType()
export class UpdateTenantBy extends PartialType(CreateTenantBy) {}
