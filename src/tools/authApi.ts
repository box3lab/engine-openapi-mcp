import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerScriptTools } from "./tools/scriptTools.js";
import { registerStorageTools } from "./tools/storageTools.js";

/**
 * 注册需要认证的API工具
 * @param server MCP服务器实例
 */
export function registerAuthTools(server: McpServer) {
  // 注册脚本相关工具
  registerScriptTools(server);

  // 注册存储相关工具
  registerStorageTools(server);
}
