import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { makeApiRequest, createAuthHeaders } from "../../utils/api.js";
import { z } from "zod";
import { authParams } from "../../types/index.js";

/**
 * 注册脚本相关工具
 * @param server MCP服务器实例
 */
export function registerScriptTools(server: McpServer) {
  /**
   * 保存或更新神岛引擎脚本
   */
  server.tool(
    "script.saveOrUpdate",
    "保存或更新神岛引擎脚本",
    {
      mapId: z.string().describe("地图ID"),
      name: z.string().describe("脚本名称（.js后缀必传）"),
      type: z.string().describe("脚本类型：0-服务器脚本、1-客户端脚本"),
      file: z.string().describe("脚本内容"),
      ...authParams,
    },
    async ({ name, mapId, type, file, token, userAgent }, extra) => {
      const headers = createAuthHeaders(token, userAgent);
      return await makeApiRequest(
        `/script/save-or-update`,
        "POST",
        headers,
        {
          mapId,
          name,
          type,
        },
        file
      );
    }
  );

  /**
   * 重命名神岛引擎脚本
   */
  server.tool(
    "script.rename",
    "重命名神岛引擎脚本",
    {
      mapId: z.string().describe("地图ID"),
      name: z.string().describe("脚本名称（.js后缀必传）"),
      newName: z.string().describe("新脚本名称（.js后缀必传）"),
      ...authParams,
    },
    async ({ name, mapId, newName, token, userAgent }, extra) => {
      const headers = createAuthHeaders(token, userAgent);
      return await makeApiRequest(`/script/rename`, "POST", headers, {
        mapId,
        name,
        newName,
      });
    }
  );

  /**
   * 代码审查提示
   */
  server.prompt(
    "script.review",
    "神岛引擎脚本代码审查",
    { code: z.string().describe("需要审查的代码") },
    ({ code }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `请审查以下神岛引擎脚本代码，提供改进建议和潜在问题的分析：\n\n${code}`,
          },
        },
      ],
    })
  );

  /**
   * 代码生成提示
   */
  server.prompt(
    "script.generate",
    "神岛引擎脚本代码生成",
    {
      description: z.string().describe("功能描述"),
      requirements: z.string().describe("功能需求，用逗号分隔").optional(),
      apiReferences: z.string().describe("API参考，用逗号分隔").optional(),
    },
    (params) => {
      const { description, requirements, apiReferences } = params;
      let prompt = `请为神岛引擎生成一段脚本代码，实现以下功能：\n\n${description}\n\n`;

      if (requirements) {
        prompt += "需求列表：\n";
        const reqList = requirements.split(",").map((item) => item.trim());
        reqList.forEach((req, index) => {
          prompt += `${index + 1}. ${req}\n`;
        });
        prompt += "\n";
      }

      if (apiReferences) {
        prompt += "API参考：\n";
        const apiList = apiReferences.split(",").map((item) => item.trim());
        apiList.forEach((api) => {
          prompt += `- ${api}\n`;
        });
      }

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt,
            },
          },
        ],
      };
    }
  );

  /**
   * 代码优化提示
   */
  server.prompt(
    "script.optimize",
    "神岛引擎脚本代码优化",
    {
      code: z.string().describe("需要优化的代码"),
      goal: z
        .string()
        .describe("优化目标，如性能、可读性、内存占用等")
        .optional(),
    },
    (params) => {
      const { code, goal } = params;
      let prompt = `请优化以下神岛引擎脚本代码：\n\n${code}\n\n`;

      if (goal) {
        prompt += `优化目标：${goal}`;
      } else {
        prompt += "请从性能、可读性和最佳实践的角度进行优化。";
      }

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: prompt,
            },
          },
        ],
      };
    }
  );
}
