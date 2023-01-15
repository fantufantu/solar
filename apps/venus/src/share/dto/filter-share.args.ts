import { TargetType } from '../entities/share.entity';

export class FilterShareArgs {
  /**
   * 目标类型
   */
  targetType: TargetType;

  /**
   * 目标 id 列表
   */
  targetIds: number[];
}
