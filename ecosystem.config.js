/**
 * @description
 * ！！！部署过程中请务必按顺序部署！！！
 */
module.exports = {
  apps: [
    // 环境变量
    {
      name: 'pluto',
      script: 'pnpm',
      args: 'start:pluto',
    },
    // 基础服务
    {
      name: 'mercury',
      script: 'pnpm',
      args: 'start:mercury',
    },
    // 记账服务
    {
      name: 'venus',
      script: 'pnpm',
      args: 'start:venus',
    },
    // 博客服务
    {
      name: 'earth',
      script: 'pnpm',
      args: 'start:earth',
    },
    // 集成服务
    {
      name: 'halley',
      script: 'pnpm',
      args: 'start:halley',
    },
  ],
};
