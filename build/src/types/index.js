/**
 * 类型定义文件
 */
import { z } from "zod";
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
