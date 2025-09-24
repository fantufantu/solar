/**
 * 查询简历列表参数
 */
export interface ResumesWhere {
  /**
   * 用户`id`
   * - 如果是管理员，则返回所有简历
   * - 如果是普通用户，则返回当前用户的简历
   * - 如果不传，则返回所有简历
   */
  who?: number;

  /**
   * 简历模板`code`
   * - 如果传了，则返回使用这些模板创建的简历
   */
  templateCodes?: string[];
}
