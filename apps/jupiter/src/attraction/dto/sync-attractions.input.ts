import type { ValueOf } from '@aiszlab/relax/types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export const ATTRACTION_SYNC_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type AttractionSyncAction = ValueOf<typeof ATTRACTION_SYNC_ACTION>;

registerEnumType(ATTRACTION_SYNC_ACTION, {
  name: GRAPHQL_ENUM_TOKEN.ATTRACTION_SYNC_ACTION,
  description: '景点同步操作类型',
});

@InputType()
export class SyncAttractionInput {
  @Field(() => ATTRACTION_SYNC_ACTION, { description: '同步操作' })
  @IsEnum(ATTRACTION_SYNC_ACTION)
  action!: AttractionSyncAction;

  @Field(() => String, { description: '景点`code`' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @Field(() => String, { nullable: true, description: '景点名称' })
  @ValidateIf(
    (input: SyncAttractionInput) =>
      input.action === ATTRACTION_SYNC_ACTION.CREATE || input.name !== void 0,
  )
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field(() => String, { nullable: true, description: '所属行政区`code`' })
  @ValidateIf(
    (input: SyncAttractionInput) =>
      input.action === ATTRACTION_SYNC_ACTION.CREATE ||
      input.districtCode !== void 0,
  )
  @IsString()
  @IsNotEmpty()
  districtCode?: string;

  @Field(() => String, { nullable: true, description: '景点代表图' })
  @ValidateIf(
    (input: SyncAttractionInput) =>
      input.action === ATTRACTION_SYNC_ACTION.CREATE || input.image !== void 0,
  )
  @IsString()
  @IsNotEmpty()
  image?: string;
}

@InputType()
export class SyncAttractionsInput {
  @Field(() => [SyncAttractionInput], { description: '待同步的景点列表' })
  @ArrayNotEmpty()
  @ArrayUnique((item: SyncAttractionInput) => item.code)
  @ValidateNested({ each: true })
  items!: SyncAttractionInput[];
}
