# 天问系统 API 文档

## 概述

天问系统提供了完整的 RESTful API，支持所有术数引擎的调用。

**基础 URL**: `http://localhost:4000`

## 系统状态接口

### 健康检查
```
GET /api/health
```

返回系统状态和可用的引擎列表。

**响应示例**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 123.456,
    "engines": [
      "meihua", "liuyao", "bazi", "qimen", "ziwei", 
      "liuren", "xiaochengtu", "huangli", "huangji", "cegui"
    ]
  }
}
```

### 获取系统列表
```
GET /api/systems
```

返回所有支持的术数系统及其描述。

**响应示例**:
```json
{
  "success": true,
  "data": {
    "systems": [
      {
        "id": "meihua",
        "name": "梅花易数",
        "description": "时间/数字/铜钱起卦，体用生克分析",
        "inputMode": "random|time"
      }
    ]
  }
}
```

### 随机数生成
```
GET /api/random?count=3&min=1&max=100
```

生成加密安全的随机数，用于起卦。

**参数**:
- `count`: 生成数量 (默认 3，最大 20)
- `min`: 最小值 (默认 1)
- `max`: 最大值 (默认 100)

## 统一预测接口 (Pipeline)

### POST /api/predict

通过统一的 Pipeline 接口进行预测。

**请求体**:
```json
{
  "question": "今日运势如何?",
  "category": "general",
  "system": "meihua",
  "mode": "single",
  "timestamp": "2024-01-01T12:00:00Z",
  "birth": {
    "year": 1990,
    "month": 1,
    "day": 1,
    "hour": 0,
    "gender": "male",
    "calendar": "solar"
  },
  "location": {
    "latitude": 39.9042,
    "longitude": 116.4074
  }
}
```

### GET /api/predict

通过 URL 参数进行简单预测。

```
GET /api/predict?question=今日运势&system=meihua&year=1990&month=1&day=1
```

## 各术数系统接口

### 梅花易数

```
GET /api/meihua/divinate?method=time
GET /api/meihua/divinate?method=number&n1=1&n2=2&n3=3
GET /api/meihua/divinate?method=random
```

### 六爻纳甲

```
GET /api/liuyao/divinate?method=time
GET /api/liuyao/divinate?method=number&n1=1&n2=2&n3=3&n4=4&n5=5&n6=6
GET /api/liuyao/divinate?method=coin
```

### 八字命理

```
GET /api/bazi/calculate?year=1990&month=1&day=1&gender=male
```

### 奇门遁甲

```
GET /api/qimen/layout
```

### 紫微斗数

```
GET /api/ziwei/layout?year=1990&month=1&day=1&gender=男
```

### 大六壬

```
GET /api/liuren/calculate?year=2024&month=1&day=1&hour=12
```

### 小成图

```
GET /api/xiaochengtu/calculate?n1=1&n2=2&n3=3
```

### 老黄历

```
GET /api/huangli?year=2024&month=1&day=1
```

### 皇极经世

```
GET /api/huangji/calculate?year=2024&month=1&day=1&hour=0
```

### 策轨数

```
GET /api/cegui/calculate?year=2024&month=1&day=1&hour=0
```

## 响应格式

所有 API 响应采用统一格式：

```json
{
  "success": true,
  "data": { ... },
  "error": "错误信息 (仅在失败时)"
}
```

## CORS

API 支持跨域请求，允许所有来源。

## 启动服务

```bash
cd apps/server
npm run dev
```

服务将在 `http://localhost:4000` 启动。
