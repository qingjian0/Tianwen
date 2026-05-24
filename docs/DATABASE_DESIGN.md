# 天问系统 - 数据库设计文档

## 概述

本文档描述天问系统的 PostgreSQL 数据库架构设计，包括用户系统、推演历史、数据持久化等模块。

## 技术栈

- **数据库**: PostgreSQL 16+
- **ORM**: Prisma (推荐) 或 TypeORM
- **缓存**: Redis 7+
- **迁移工具**: Prisma Migrate

## ER 图概览

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ avatar_url      │
│ preferences     │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1
         │
         │ N
┌────────▼────────┐
│  Divinations    │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ system_type     │
│ input_data      │
│ result_data     │
│ interpretation  │
│ tags            │
│ is_favorite     │
│ created_at      │
└────────┬────────┘
         │
         │ 1
         │
         │ N
┌────────▼────────┐
│   Notes         │
├─────────────────┤
│ id (PK)         │
│ divination_id   │
│ user_id         │
│ content         │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│  SystemConfigs  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ system_type     │
│ config_data     │
│ is_default      │
└─────────────────┘

┌─────────────────┐
│  Analytics      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ event_type      │
│ event_data      │
│ created_at      │
└─────────────────┘
```

## 表结构设计

### 1. Users 表

用户账户信息表。

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
);

COMMENT ON TABLE users IS '用户账户信息';
```

### 2. Divinations 表

推演历史记录表，存储所有术数系统的推演结果。

```sql
CREATE TABLE divinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- 术数系统类型
    system_type VARCHAR(50) NOT NULL, -- 'meihua', 'qimen', 'liuren', 'bazi', 'ziwei', etc.

    -- 输入数据
    input_data JSONB NOT NULL,

    -- 计算结果
    result_data JSONB NOT NULL,

    -- 解读信息
    interpretation TEXT,
    ai_interpretation TEXT,

    -- 元数据
    tags VARCHAR(255)[],
    is_favorite BOOLEAN DEFAULT false,
    notes_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- 索引
    INDEX idx_divinations_user_id (user_id),
    INDEX idx_divinations_system_type (system_type),
    INDEX idx_divinations_created_at (created_at),
    INDEX idx_divinations_user_created (user_id, created_at DESC),
    INDEX idx_divinations_tags (tags) USING GIN,
    INDEX idx_divinations_is_favorite (user_id, is_favorite)
);

COMMENT ON TABLE divinations IS '推演历史记录';
```

### 3. Notes 表

笔记表，用户对推演的笔记。

```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    divination_id UUID REFERENCES divinations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    INDEX idx_notes_divination_id (divination_id),
    INDEX idx_notes_user_id (user_id)
);

COMMENT ON TABLE notes IS '推演笔记';
```

### 4. SystemConfigs 表

系统配置表，存储用户对各个术数系统的偏好设置。

```sql
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    system_type VARCHAR(50) NOT NULL,
    config_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, system_type),
    INDEX idx_system_configs_user (user_id)
);

COMMENT ON TABLE system_configs IS '术数系统配置';
```

### 5. Analytics 表

分析统计表，用于用户行为分析。

```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    INDEX idx_analytics_user_id (user_id),
    INDEX idx_analytics_event_type (event_type),
    INDEX idx_analytics_created_at (created_at)
);

COMMENT ON TABLE analytics IS '用户行为分析';
```

### 6. Sessions 表

用户会话表，用于认证。

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    INDEX idx_sessions_token (token),
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_expires_at (expires_at)
);

COMMENT ON TABLE sessions IS '用户会话';
```

## Prisma Schema 示例

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username       String         @unique @db.VarChar(50)
  email          String         @unique @db.VarChar(255)
  passwordHash   String         @db.VarChar(255)
  avatarUrl      String?        @db.VarChar(500)
  preferences    Json           @default("{}")
  isActive       Boolean        @default(true)
  isAdmin        Boolean        @default(false)
  lastLoginAt    DateTime?      @db.Timestamptz
  createdAt      DateTime       @default(now()) @db.Timestamptz
  updatedAt      DateTime       @default(now()) @db.Timestamptz
  divinations    Divination[]
  notes          Note[]
  systemConfigs  SystemConfig[]
  analytics      Analytic[]
  sessions       Session[]
}

model Divination {
  id               String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId           String         @db.Uuid
  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  systemType       String         @db.VarChar(50)
  inputData        Json
  resultData       Json
  interpretation   String?
  aiInterpretation String?
  tags             String[]
  isFavorite       Boolean        @default(false)
  notesCount       Int            @default(0)
  createdAt        DateTime       @default(now()) @db.Timestamptz
  notes            Note[]

  @@index([userId])
  @@index([systemType])
  @@index([createdAt])
  @@index([userId, createdAt])
}

model Note {
  id            String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  divinationId  String     @db.Uuid
  userId        String     @db.Uuid
  divination    Divination @relation(fields: [divinationId], references: [id], onDelete: Cascade)
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  content       String
  createdAt     DateTime   @default(now()) @db.Timestamptz
  updatedAt     DateTime   @default(now()) @db.Timestamptz

  @@index([divinationId])
  @@index([userId])
}

model SystemConfig {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String   @db.Uuid
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  systemType  String   @db.VarChar(50)
  configData  Json
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now()) @db.Timestamptz
  updatedAt   DateTime @default(now()) @db.Timestamptz

  @@unique([userId, systemType])
  @@index([userId])
}

model Analytic {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId     String   @db.Uuid
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventType  String   @db.VarChar(50)
  eventData  Json?
  createdAt  DateTime @default(now()) @db.Timestamptz

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
}

model Session {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId     String   @db.Uuid
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token      String   @unique @db.VarChar(500)
  expiresAt  DateTime @db.Timestamptz
  ipAddress  String?  @db.VarChar(45)
  userAgent  String?
  createdAt  DateTime @default(now()) @db.Timestamptz

  @@index([token])
  @@index([userId])
  @@index([expiresAt])
}
```

## 数据存储结构

### 输入数据结构 (input_data)

**梅花易数**:
```json
{
  "method": "time|number|manual",
  "numbers": [12, 34, 56],
  "date": "2024-01-01T12:00:00Z",
  "useTrueSun": true,
  "coordinates": { "latitude": 39.9, "longitude": 116.4 },
  "manualSelection": {
    "shangGua": "乾",
    "xiaGua": "坤",
    "dongYao": [3]
  }
}
```

**奇门遁甲**:
```json
{
  "date": "2024-01-01T12:00:00Z",
  "panType": "chaibu|zhirun|maoshan",
  "panJuType": "zhuan|fei",
  "zhiShiMethod": "menshi|dish"
}
```

### 结果数据结构 (result_data)

**梅花易数**:
```json
{
  "benGua": { "name": "乾", "yaos": [...] },
  "huGua": { ... },
  "bianGua": { ... },
  "tiYong": { "ti": "乾", "yong": "坤", "relation": "kesheng" },
  "interpretation": "..."
}
```

## Redis 缓存策略

### 缓存键设计

```
# 用户会话
session:{token} -> {userId, expiresAt, userData}

# 推演历史（最新 100 条）
divinations:recent:{userId} -> [divination1, divination2, ...]

# 统计数据
stats:daily:{userId}:{date} -> {count, systemsUsed}

# 热门系统配置
config:default:{systemType} -> {configData}

# 缓存热门解读（用于演示）
interpretation:cache:{systemType}:{signature} -> {interpretation}
```

### 缓存过期时间

- Session: 7 天
- 推演历史: 30 分钟
- 统计数据: 1 小时
- 系统配置: 永久（有更新时清除）

## 性能优化策略

1. **索引优化**: 为常用查询字段添加索引
2. **分页查询**: 使用游标分页而非 offset
3. **JSONB 查询**: 利用 PostgreSQL 的 GIN 索引优化 JSON 查询
4. **读写分离**: 使用 PostgreSQL 流复制
5. **连接池**: 使用连接池管理数据库连接
6. **数据归档**: 历史数据定期归档

## 安全措施

1. **密码加密**: 使用 bcrypt 或 Argon2
2. **SQL 注入防护**: 使用参数化查询
3. **XSS 防护**: 输入输出转义
4. **数据加密**: 敏感字段加密存储
5. **审计日志**: 记录重要操作
6. **权限控制**: 严格的访问控制

## 备份策略

- **每日完整备份**: 保留 30 天
- **WAL 归档**: 支持 PITR
- **异地备份**: 多地域备份
- **备份验证**: 定期验证备份可恢复
