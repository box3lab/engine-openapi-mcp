/**
 * 类型定义文件
 */

import { z } from "zod";

// 请求头类型定义
export interface AuthHeaders {
  Authorization: string;
  "user-agent": string;
  "x-dao-ua": string;
}

// 引擎开放接口工具定义
export interface EngineEndpoint {
  name: string;
  description: string;
  path: string;
}

// 导出常量类型
export const API_BASE_URL = "https://code-api-pc.dao3.fun/open";
export const SERVER_NAME = "@dao3fun/engine-openapi-mcp";
export const SERVER_VERSION = "0.0.1";

/**
 * 通用认证参数
 */
export const authParams = {
  token: z.string().describe("认证Token"),
  userAgent: z.string().describe("用户请求头"),
};
