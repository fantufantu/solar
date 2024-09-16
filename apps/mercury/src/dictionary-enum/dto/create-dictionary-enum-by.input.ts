import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { DictionaryEnum } from '@/lib/database/entities/mercury/dictionary-enum.entity';

@InputType()
export class CreateDictionaryEnumBy extends PickType(
  DictionaryEnum,
  ['code', 'description', 'sortBy'],
  InputType,
) {
  @Field(() => Int, {
    description: '字典id',
  })
  parentId: number;
}
