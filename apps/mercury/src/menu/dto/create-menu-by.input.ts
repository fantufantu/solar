// nest
import { PickType, InputType, Field } from '@nestjs/graphql';
// project
import { Menu } from '../entities/menu.entity';
import { AuthorizationResourceCode } from '../../auth/entities/authorization-resource.entity';

@InputType()
export class CreateMenuBy extends PickType(
  Menu,
  ['name', 'sortBy', 'icon', 'tenantCode', 'parentId', 'component', 'to'],
  InputType,
) {
  @Field(() => [AuthorizationResourceCode], {
    description: '关联的权限资源codes',
    nullable: true,
  })
  resourceCodes?: AuthorizationResourceCode[];
}
