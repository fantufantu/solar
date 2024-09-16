import { TargetType } from '@/lib/database/entities/venus/sharing.entity';

export class FilterSharingBy {
  /**
   * 目标类型
   */
  targetType: TargetType;

  /**
   * 目标 id 列表
   */
  targetIds: number[];
}
