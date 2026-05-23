# 天问系统 API 设计文档 (RESTful + WebSocket)

## 1. 概览

天问系统提供 RESTful API 进行预测、规则查询、系统管理，同时提供 WebSocket 实时推送接口，用于获取推演进度、规则更新和系统状态。

**Base URL**: http://localhost:3000/api

**WebSocket URL**: ws://localhost:3000/ws

**版本**: v1.0

---

## 2. RESTful API

### 2.1 预测接口 (Prediction)

| 方法 | 路径             | 功能             |
| ---- | ---------------- | ---------------- |
| POST | /predictions     | 创建新的预测请求 |
| GET  | /predictions/:id | 获取指定预测结果 |
| GET  | /predictions     | 获取历史预测列表 |

#### 2.1.1 创建预测请求

**请求**

```http
POST /api/predictions
Content-Type: application/json

{
  "question": "今日财运如何？",
  "category": "wealth",       // wealth / career / love / market
  "system": "meihua",         // meihua / liuyao / bazi / qimen / ziwei
  "mode": "single"            // single / batch
}
```

**响应**

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "id": "prediction_12345",
  "status": "processing",     // processing / completed / failed
  "submittedAt": "2026-05-19T10:00:00Z",
  "estimatedCompletion": "2026-05-19T10:00:05Z"
}
```

#### 2.1.2 获取预测结果

**请求**

```http
GET /api/predictions/prediction_12345
```

**响应**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "prediction_12345",
  "status": "completed",
  "output": {
    "summary": "今日财运平稳，有小幅收益",
    "probability": {
      "success": 0.75,
      "failure": 0.25,
      "confidence": 0.85
    },
    "fortune": {
      "level": "中吉",
      "score": 75,
      "description": "财运尚可，投资宜谨慎"
    },
    "timing": {
      "favorable": ["上午", "午后"],
      "unfavorable": ["深夜"]
    },
    "signals": [
      { "name": "外应突发", "value": "平稳", "confidence": 0.8 }
    ],
    "appliedRules": [
      { "id": "bazi_rule_01", "description": "日主得地", "source": "八字规则库" }
    ],
    "knowledgeReferences": [
      { "source": "《青渐梅花易数精解》", "chapter": "卷三" }
    ],
    "calculationTrace": [
      { "stage": "Chrono", "result": "乙巳年 四月 廿二日" }
    ],
    "actionableSuggestions": ["适合小额投资"]
  }
}
```

---

### 2.2 规则接口 (Rule)

| 方法 | 路径                        | 功能                 |
| ---- | --------------------------- | -------------------- |
| GET  | /rules                      | 获取所有规则列表     |
| GET  | /rules/:id                  | 获取指定规则详细信息 |
| GET  | /rules/categories/list      | 获取规则分类列表     |
| GET  | /rules/categories/:category | 获取某分类规则       |

#### 2.2.1 示例：获取八字规则

```http
GET /api/rules/categories/bazi
```

**响应**

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": "bazi_rule_01", "name": "日主得地", "description": "日主旺相，事事顺利", "priority": 5 },
  { "id": "bazi_rule_02", "name": "用神受克", "description": "用神被克，需谨慎", "priority": 4 }
]
```

---

### 2.3 系统接口

| 方法 | 路径     | 功能         |
| ---- | -------- | ------------ |
| GET  | /health  | 健康检查     |
| GET  | /version | 系统版本信息 |

---

## 3. WebSocket 实时推送

### 3.1 URL

`ws://localhost:3000/ws`

### 3.2 频道 (Channels)

| 频道        | 功能                   |
| ----------- | ---------------------- |
| predictions | 推演状态更新与完成通知 |
| rules       | 规则库更新通知         |
| system      | 系统状态与健康监控     |

### 3.3 消息示例

#### 3.3.1 推演状态更新

```json
{
  "channel": "predictions",
  "event": "progress",
  "data": {
    "id": "prediction_12345",
    "stage": "Rule",
    "progress": 60
  },
  "timestamp": "2026-05-19T10:00:03Z"
}
```

#### 3.3.2 推演完成通知

```json
{
  "channel": "predictions",
  "event": "completed",
  "data": {
    "id": "prediction_12345",
    "status": "completed",
    "outputUrl": "/api/predictions/prediction_12345"
  },
  "timestamp": "2026-05-19T10:00:05Z"
}
```

#### 3.3.3 系统状态推送

```json
{
  "channel": "system",
  "event": "status",
  "data": {
    "cpuUsage": 45,
    "memoryUsage": 68,
    "activeConnections": 12
  },
  "timestamp": "2026-05-19T10:00:10Z"
}
```

---

## 4. 错误码约定

| HTTP 状态码 | 说明               |
| ----------- | ------------------ |
| 200         | 成功               |
| 202         | 请求已接受，处理中 |
| 400         | 请求参数错误       |
| 401         | 未授权             |
| 404         | 资源不存在         |
| 500         | 服务器内部错误     |

### WebSocket 错误消息

```json
{
  "channel": "system",
  "event": "error",
  "data": { "code": 5001, "message": "Pipeline 执行失败" },
  "timestamp": "2026-05-19T10:00:02Z"
}
```

---

## 5. 使用示例

### 5.1 使用 RESTful API

```javascript
import axios from "axios";

const response = await axios.post("http://localhost:3000/api/predictions", {
  question: "今日财运如何？",
  category: "wealth",
  system: "meihua",
  mode: "single",
});

console.log("预测请求ID:", response.data.id);
```

### 5.2 使用 WebSocket

```javascript
import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:3000/ws");

ws.on("open", () => {
  console.log("WebSocket 已连接");

  // 订阅预测频道
  ws.send(
    JSON.stringify({
      action: "subscribe",
      channel: "predictions",
    }),
  );
});

ws.on("message", (message) => {
  const msg = JSON.parse(message.toString());
  console.log("收到消息:", msg);
});
```

---

## 6. API 文档和仪表盘集成

在仪表盘中添加 "API 文档" 页面，实时展示 RESTful 和 WebSocket 使用说明。

支持快速测试接口和 WebSocket 订阅。

可与推演流水线数据实时联动。
