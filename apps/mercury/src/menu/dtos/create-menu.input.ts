import { Menu } from '@app/data-base/entities/boomemory';
import { AuthorizationResourceCode } from '@app/data-base/entities/boomemory/authorization-resource.entity';
import { PickType, InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMenuInput extends PickType(
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
