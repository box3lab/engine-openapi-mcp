import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_NAME, SERVER_VERSION } from "./src/types/index.js";
import { registerAuthTools } from "./src/tools/authApi.js";
/**
 * 神岛MCP服务器
 * 提供引擎开放接口能力
 */
const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
});
// 注册需要认证的API工具
registerAuthTools(server);
// 连接并启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
