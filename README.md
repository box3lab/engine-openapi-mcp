# 神岛引擎 OpenAPI MCP 工具集

这个项目提供了一系列用于神岛引擎的 OpenAPI MCP (Model Context Protocol) 工具，帮助 AI 更高效地调用引擎接口。

## 功能概览

该工具集提供以下核心功能：

- **脚本管理工具**：用于创建、更新、重命名游戏脚本
- **存储管理工具**：用于读取、写入、删除和查询游戏数据存储
- **AI 辅助功能**：提供基于大模型的代码审查、生成、优化和数据结构设计

## API 工具详解

### 脚本管理工具 (Script Tools)

#### 基础操作

| 工具名称              | 描述                     | 必要参数                                              |
| --------------------- | ------------------------ | ----------------------------------------------------- |
| `script.saveOrUpdate` | A 保存或更新神岛引擎脚本 | `mapId`, `name`, `type`, `file`, `token`, `userAgent` |
| `script.rename`       | 重命名神岛引擎脚本       | `mapId`, `name`, `newName`, `token`, `userAgent`      |

#### 代码辅助提示

| 提示名称          | 描述                                             | 必要参数      |
| ----------------- | ------------------------------------------------ | ------------- |
| `script.review`   | 审查神岛引擎脚本代码，提供改进建议和潜在问题分析 | `code`        |
| `script.generate` | 根据描述和需求生成神岛引擎脚本代码               | `description` |
| `script.optimize` | 优化神岛引擎脚本代码，提高性能或可读性           | `code`        |

### 存储管理工具 (Storage Tools)

#### 基础操作

| 工具名称         | 描述                       | 必要参数                                                     |
| ---------------- | -------------------------- | ------------------------------------------------------------ |
| `storage.get`    | 存储空间单 key 值查询      | `key`, `mapId`, `storageName`, `token`, `userAgent`          |
| `storage.set`    | 存储空间单 key 值写入/更新 | `key`, `mapId`, `storageName`, `value`, `token`, `userAgent` |
| `storage.remove` | 存储空间单 key 值删除      | `key`, `mapId`, `storageName`, `token`, `userAgent`          |
| `storage.page`   | 存储空间分页查询           | `key`, `mapId`, `storageName`, `token`, `userAgent`          |

#### 存储辅助提示

| 提示名称                | 描述                             | 必要参数                        |
| ----------------------- | -------------------------------- | ------------------------------- |
| `storage.designSchema`  | 为游戏功能设计键值对数据存储结构 | `gameFeatures`                  |
| `storage.migrationPlan` | 设计存储数据迁移方案             | `currentSchema`, `targetSchema` |
| `storage.optimizeQuery` | 优化键值对数据查询方案           | `queryDescription`              |

## 使用示例

### 脚本管理示例

```javascript
// 上传脚本文件
const scriptResult = await mcpClient.callTool("script.saveOrUpdate", {
  mapId: "your-map-id",
  name: "example.js",
  type: "0", // 0-服务器脚本、1-客户端脚本
  file: "console.log('hi')",
  token: "your-auth-token",
  userAgent: "your-user-agent",
});

// 使用代码审查提示
const codeReview = await mcpClient.prompt("script.review", {
  code: "function example() { console.log('Hello'); }",
});

// 生成脚本代码
const generatedCode = await mcpClient.prompt("script.generate", {
  description: "实现一个计算玩家得分的系统",
  requirements: "支持多种得分方式,保存历史最高分,支持排行榜",
});
```

### 存储管理示例

```javascript
// 读取存储值
const storageData = await mcpClient.callTool("storage.get", {
  key: "player_stats",
  mapId: "your-map-id",
  storageName: "gameData",
  token: "your-auth-token",
  userAgent: "your-user-agent",
});

// 写入存储值
const writeResult = await mcpClient.callTool("storage.set", {
  key: "player_stats",
  mapId: "your-map-id",
  storageName: "gameData",
  value: JSON.stringify({ score: 100, level: 5 }),
  token: "your-auth-token",
  userAgent: "your-user-agent",
});

// 使用数据结构设计提示
const schemaDesign = await mcpClient.prompt("storage.designSchema", {
  gameFeatures: "一个RPG游戏，需要存储玩家装备、背包物品、任务进度和成就",
  dataRequirements: "支持多人同时在线,支持离线进度保存,支持物品交易历史",
});
```

## 集成到客户端

### 浏览器端集成

```javascript
import { McpClient } from "@modelcontextprotocol/sdk/client/index.js";

// 初始化客户端
const mcpClient = new McpClient({
  serverUrl: "https://your-mcp-server.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 使用工具
async function useTools() {
  const result = await mcpClient.callTool("storage.get", {
    // 参数...
  });

  // 处理结果
  console.log(result);
}
```

### Node.js 端集成

```javascript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js";

// 创建传输通道
const transport = new WebSocketClientTransport({
  url: "ws://localhost:3000",
});

// 初始化客户端
const client = new Client(
  { name: "dao3-client", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 连接到服务器
await client.connect(transport);

// 使用工具
const result = await client.callTool({
  name: "script.list",
  arguments: {
    mapId: "your-map-id",
    token: "your-token",
    userAgent: "your-agent",
  },
});
```

## 认证

所有 API 调用都需要提供认证信息，包括：

- `token`: 授权令牌
- `userAgent`: 用户代理字符串

这些参数需要在每个工具调用时提供。

### 获取认证信息

1. 访问神岛引擎开发者平台获取开发者密钥
2. 使用开发者密钥生成认证令牌
3. 在 API 调用中提供认证信息

## 故障排除

### 请求超时

如果请求超时，可能是因为：

- 网络连接不稳定
- 服务器负载过高
- 请求数据量过大

尝试减少请求数据量或稍后重试。

### 类型错误

确保按照文档中指定的类型传递参数，特别是:

- 数值类型的参数（如 limit、offset）必须是数字
- 布尔值参数（如 isGroup）必须是布尔值

## 贡献指南

欢迎提交问题报告或 Pull Request 来帮助改进这个项目。

1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request
