# User ID 重构计划：自增数字 → UUID 字符串

## 核心原则

- **只改 User 表的 `id` 及指向 User 的外键字段**，不改其他实体自身的 ID（如 `Membership.id`、`Billing.id` 等仍为自增数字）
- `IdentifiedTimeStamped` 和 `IdentifiedTracked` 保持不变（其他实体继续使用自增 ID）
- `Authored.createdById` / `Authored.updatedById` 需要改为 `string`（它们指向 User 表）
- `Tracked.deletedById` 需要改为 `string`

---

## 阶段一：实体层 (libs/database/src/entities/)

### 1.1 基础实体

| 文件 | 变更 |
|------|------|
| `libs/database/src/entities/any-use/authored.entity.ts` | `createdById!: number` → `string`，`updatedById!: number` → `string`，`@Field(() => Int)` → `@Field(() => String)`，Column 加 `type: 'varchar', length: 36` |
| `libs/database/src/entities/any-use/tracked.entity.ts` | `set deletedById(deleteById: number)` → `string` |

### 1.2 User 实体（Mercury — 权威表）

**文件**: `libs/database/src/entities/mercury/user.entity.ts`

当前继承 `IdentifiedTimeStamped`（其 `id` 为 `@PrimaryGeneratedColumn` 自增数字）。

改为 **override `id` 字段**，使用 `@PrimaryGeneratedColumn('uuid')`：

```typescript
// 在 User 类中新增 override：
@Field(() => String, { description: 'id' })
@PrimaryGeneratedColumn('uuid', { comment: 'id', name: 'id' })
id!: string;
```

### 1.3 User 实体（Venus / Jupiter / Earth / Mars — 视图投影）

| 文件 | 变更 |
|------|------|
| `libs/database/src/entities/venus/user.entity.ts` | `id!: number` → `string`，`@Field(() => Int)` → `@Field(() => String)`，`@PrimaryColumn` → `@PrimaryColumn({ type: 'varchar', length: 36 })` |
| `libs/database/src/entities/jupiter/user.entity.ts` | 同上 |
| `libs/database/src/entities/earth/user.entity.ts` | 同上 |
| `libs/database/src/entities/mars/user.entity.ts` | 同上 |

### 1.4 关联实体（FK 指向 User）

| 文件 | 字段 | 变更 |
|------|------|------|
| `libs/database/src/entities/mercury/role-with-user.entity.ts` | `userId!: number` | → `string`，`@Column` 加 `type: 'varchar', length: 36` |
| `libs/database/src/entities/venus/sharing.entity.ts` | `sharedById!: number` | → `string`（指向 User），`targetId` 保持不变（多态 FK） |

---

## 阶段二：类型定义

| 文件 | 变更 |
|------|------|
| `typings/micro-service.d.ts` | `GetUserBy.id?: number` → `id?: string` |

---

## 阶段三：Passport / 认证层

| 文件 | 变更 |
|------|------|
| `libs/passport/src/passport.service.ts` | `sign(id: number)` → `sign(id: string)` |
| `libs/passport/src/dto/authentication.ts` | `id: number` → `id: string`，`@Field(() => Int)` → `@Field(() => String)` |
| `utils/interceptors/authenticated.interceptor.ts` | `CallHandler<[authenticated: string, userId: number]>` → `userId: string` |

---

## 阶段四：Mercury 微服务（权威数据源）

### 4.1 Controller 层

| 文件 | 方法 | 变更 |
|------|------|------|
| `apps/mercury/src/user/user.controller.ts` | `users(ids: number[])` | → `ids: string[]` |
| `apps/mercury/src/authentication/authentication.controller.ts` | `isLoggedIn(userId: number)` | → `userId: string` |

### 4.2 Service 层

| 文件 | 方法 | 变更 |
|------|------|------|
| `apps/mercury/src/user/user.service.ts` | `getUsersByIds(ids: number[])` | → `ids: string[]` |
| | `updateUser(id: number, ...)` | → `id: string` |
| | `roleCodes(who: number)` | → `who: string` |
| | `authorizations({ who }: { who: number })` | → `who: string` |
| `apps/mercury/src/authentication/authentication.service.ts` | `isLoggedIn(userId: number)` | → `userId: string` |
| | `logout(userId: number)` | → `userId: string` |
| | `login()`/`register()` 返回值 | `[string, number]` → `[string, string]` |
| `apps/mercury/src/authorization/authorization.service.ts` | `create(..., who: number)` | → `who: string` |
| | `remove(id: number, who: number)` | → `who: string`，注意 `id` 是 Authorization 自身的 id（非 userId），保持 `number` |

### 4.3 Resolver 层

| 文件 | 变更 |
|------|------|
| `apps/mercury/src/user/user.resolver.ts` | `ResolveReference` 参数 `id: number` → `id: string`；`whoAreYou` 的 `@Args('id', { type: () => Int })` → `() => String` |
| `apps/mercury/src/authentication/authentication.resolver.ts` | `logout(who.id)` → 参数类型自动跟随 User |

### 4.4 DTO 层

| 文件 | 变更 |
|------|------|
| `apps/mercury/src/user/dto/assign-roles.input.ts` | `userId: number` → `string`，`@Field(() => Int)` → `@Field(() => String)` |
| `apps/mercury/src/role/dto/update-role.input.ts` | `userIds?: number[]` → `string[]`，`@Field(() => [Int])` → `@Field(() => [String])` |

---

## 阶段五：客户端库

| 文件 | 变更 |
|------|------|
| `libs/mercury-client/src/mercury-client.service.ts` | `getUsers(ids: number[])` → `ids: string[]` |
| | `isAuthorized(who: number, ...)` → `who: string` |
| | `isLoggedIn(userId: number)` → `userId: string` |
| `libs/cache/src/cache.service.ts` | `setAuthenticated(userId: number)` → `string` |
| | `getAuthenticated(userId: number)` → `string` |
| | `removeAuthenticated(userId: number)` → `string` |
| `assets/guards.ts` (AuthorizationGuard) | 无需改动（`user.id` 自动跟随 User 类型） |

---

## 阶段六：各业务服务

### 6.1 Venus

| 文件 | 变更 |
|------|------|
| `apps/venus/src/user/user.service.ts` | `user(id: number)` → `id: string`；`updateDefaultBilling(..., userId: number)` → `userId: string` |
| `apps/venus/src/billing/billing.service.ts` | `create(..., createdById: number)` → `string`；`billing(id: number, userId: number)` → `userId: string`；`remove(id: number, userId: number)` → `userId: string` |
| `apps/venus/src/transaction/transaction.service.ts` | `create(..., createdById: number)` → `string` |
| `apps/venus/src/transaction/transaction.resolver.ts` | `createdBy` 中 `id: transaction.createdById` → 类型自动跟随 |
| `apps/venus/src/billing/billing.resolver.ts` | `createdBy` 中 `id: billing.createdById` → 类型自动跟随 |
| `apps/venus/src/sharing/sharing.loader.ts` | `DataLoader<number, User>` → `DataLoader<string, User>`；参数 `_userIds: number[]` → `string[]` |

### 6.2 Jupiter

| 文件 | 变更 |
|------|------|
| `apps/jupiter/src/user/user.service.ts` | `user(id: number)` → `id: string`；`upgradeMembership(userId: number, ...)` → `userId: string`；`membership(userId?: number)` → `userId?: string` |
| `apps/jupiter/src/user/user.resolver.ts` | `ResolveReference` 参数 `id: number` → `id: string`；`usedQuota(user.id)` → 自动跟随 |
| `apps/jupiter/src/user/dto/upgrade-membership.input.ts` | `userId!: number` → `string`（注意 `membershipId` 保持 `number`） |
| `apps/jupiter/src/city/city.service.ts` | `create(..., createdById: number)` → `string`；`update(..., updatedById: number)` → `string` |
| `apps/jupiter/src/city/city.resolver.ts` | `createdBy`/`updatedBy` → 类型自动跟随 |
| `apps/jupiter/src/attraction/attraction.service.ts` | `create(..., createdById: number)` → `string`；`update(..., updatedById: number)` → `string` |
| `apps/jupiter/src/attraction/attraction.resolver.ts` | `createdBy`/`updatedBy` → 类型自动跟随 |

### 6.3 Earth

| 文件 | 变更 |
|------|------|
| `apps/earth/src/article/article.service.ts` | `create(..., createdById: number)` → `string`；`update(..., updatedById: number)` → `string`；`remove(..., deleteById: number)` → `string`；`articleContributions(..., who: number)` → `who: string` |
| `apps/earth/src/article/article.resolver.ts` | `createdBy` → 类型自动跟随 |

### 6.4 Mars

| 文件 | 变更 |
|------|------|
| `apps/mars/src/resume/resume.service.ts` | 所有 `who: number` → `who: string` |
| `apps/mars/src/resume-template/resume-template.service.ts` | `who: number` → `who: string`；`deletedById: number` → `string` |
| `apps/mars/src/resume-template/resume-template.resolver.ts` | `createdBy`/`updatedBy` → 类型自动跟随 |

---

## 阶段七：数据库迁移

### 策略

每个数据库（mercury/venus/jupiter/earth/mars）需要执行以下迁移逻辑：

1. **User 表**：新增 `new_id VARCHAR(36)` 列 → 填充 UUID → 更新所有引用表 → 删除旧 `id` 列 → 重命名 `new_id` 为 `id` → 重建主键
2. **引用表**（含 `created_by_id`、`updated_by_id`、`user_id`、`shared_by_id` 等）：新增 `new_xxx VARCHAR(36)` 列 → 通过 JOIN User 表映射填充 → 删除旧列 → 重命名新列

### 具体 SQL（以 Mercury 为例）

```sql
-- 1. User 表添加 UUID 列
ALTER TABLE user ADD COLUMN uuid_id VARCHAR(36);
UPDATE user SET uuid_id = UUID();
-- 2. role_with_user 添加新列并映射
ALTER TABLE role_with_user ADD COLUMN new_user_id VARCHAR(36);
UPDATE role_with_user rwu
  INNER JOIN user u ON rwu.user_id = u.id
SET rwu.new_user_id = u.uuid_id;
-- 3. 所有 Authored 表类似处理...
-- 4. 删除旧列、重命名、重建主键和索引
```

> **注意**: 迁移脚本需要根据实际数据库（MySQL）语法编写，正式环境执行前务必在测试环境验证。建议编写 TypeORM migration 文件。

---

## 阶段八：验证

1. `npx tsc --noEmit` — 确保 TypeScript 编译无错误
2. 每个服务独立启动验证
3. GraphQL schema 兼容性确认（`@key(fields: "id")` 类型从 `Int` 变为 `String`）
4. 集成测试：注册 → 登录 → 各业务操作 → 验证数据一致性

---

## 总结

| 类别 | 文件数 |
|------|--------|
| 基础实体 | 2 |
| User 实体 | 5 |
| 关联实体 | 2 |
| 类型定义 | 1 |
| Passport / 认证 | 3 |
| Mercury 服务 | 7 |
| 客户端库 | 2 |
| Venus 服务 | 6 |
| Jupiter 服务 | 7 |
| Earth 服务 | 2 |
| Mars 服务 | 5 |
| 数据库迁移 | 1+ |
| **总计** | **~43 个文件** |
