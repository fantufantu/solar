import { TargetType } from '@/libs/database/entities/venus/sharing.entity';

export class FilterSharingsBy {
  /**
   * @description
   * 目标类型
   */
  targetType: TargetType;

  /**
   * @description
   * 目标 id 列表
   */
  targetIds: number[];
}
