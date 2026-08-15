import type { ValueOf } from '@aiszlab/relax/types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { GRAPHQL_ENUM_TOKEN } from 'constants/common.constant';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  DISTRICT_LEVEL,
  DistrictLevel,
} from '@/libs/database/entities/jupiter/district.entity';

export const DISTRICT_SYNC_ACTION = {
  create: 'create',
  update: 'update',
  delete: 'delete',
} as const;

export type DistrictSyncAction = ValueOf<typeof DISTRICT_SYNC_ACTION>;

registerEnumType(DISTRICT_SYNC_ACTION, {
  name: GRAPHQL_ENUM_TOKEN.DISTRICT_SYNC_ACTION,
  description: '行政区同步操作类型',
});

@InputType()
export class SyncDistrictInput {
  @Field(() => DISTRICT_SYNC_ACTION, { description: '同步操作' })
  @IsEnum(DISTRICT_SYNC_ACTION)
  action!: DistrictSyncAction;

  @Field(() => String, { description: '行政区 code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @Field(() => String, { nullable: true, description: '行政区名称' })
  @ValidateIf(
    (input: SyncDistrictInput) =>
      input.action === DISTRICT_SYNC_ACTION.create || input.name !== undefined,
  )
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field(() => DISTRICT_LEVEL, { nullable: true, description: '行政区级别' })
  @ValidateIf(
    (input: SyncDistrictInput) =>
      input.action === DISTRICT_SYNC_ACTION.create || input.level !== undefined,
  )
  @IsEnum(DISTRICT_LEVEL)
  level?: DistrictLevel;

  @Field(() => String, { nullable: true, description: '行政区代表图' })
  @ValidateIf(
    (input: SyncDistrictInput) =>
      input.action === DISTRICT_SYNC_ACTION.create || input.image !== undefined,
  )
  @IsString()
  @IsNotEmpty()
  image?: string;

  @Field(() => String, { nullable: true, description: '父级行政区 code' })
  @IsOptional()
  @IsString()
  parentCode?: string;
}

@InputType()
export class SyncDistrictsInput {
  @Field(() => [SyncDistrictInput], { description: '待同步的行政区列表' })
  @ArrayNotEmpty()
  @ArrayUnique((item: SyncDistrictInput) => item.code)
  @ValidateNested({ each: true })
  items!: SyncDistrictInput[];
}
