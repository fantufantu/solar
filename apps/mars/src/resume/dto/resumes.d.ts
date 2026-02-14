/**
 * 查询简历列表参数
 */
export interface ResumesWhere {
  /**
   * 用户`id`
   * - 如果是简历管理员，代表用户拥有查看所有简历的权限
   * - 如果是普通用户，则返回当前用户的简历
   */
  who: number;
}
