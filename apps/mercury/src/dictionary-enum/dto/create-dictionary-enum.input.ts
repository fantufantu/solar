import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { DictionaryEnum } from '@/libs/database/entities/mercury/dictionary-enum.entity';

@InputType()
export class CreateDictionaryEnumInput extends PickType(
  DictionaryEnum,
  ['code', 'name', 'sortBy'],
  InputType,
) {
  @Field(() => Int, {
    description: '所属字典`id`',
  })
  parentId: number;
}
