import axios from "axios";
import { API_BASE_URL } from "../types/index.js";
import FormData from "form-data";
/**
 * 发起API请求并格式化响应
 * @param endpoint API端点
 * @param method HTTP方法
 * @param headers 请求头(可选)
 * @param data 请求数据(可选)
 * @param file 文件(可选)
 * @returns 格式化的MCP响应
 */
export async function makeApiRequest(endpoint, method, headers, data, file) {
    try {
        if (file) {
            const fileContent = Buffer.isBuffer(file)
                ? file
                : Buffer.from(file, "utf-8");
            const formData = new FormData();
            if (data) {
                Object.keys(data).forEach((key) => {
                    formData.append(key, data[key]);
                });
            }
            formData.append("file", fileContent, {
                filename: data.name || "App.js",
                contentType: "application/javascript",
            });
            headers["Content-Type"] = "multipart/form-data";
            data = formData;
        }
        // 创建配置对象
        const config = {
            method,
            url: `${API_BASE_URL}${endpoint}`,
            headers,
        };
        // 如果是 GET 请求，参数放入 params
        if (method === "GET" && data) {
            config.params = data;
        }
        // 如果是 POST 或 DELETE 请求，参数放入 data
        else if (data) {
            config.data = data;
        }
        const response = await axios(config);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(response.data),
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: "API请求失败",
                        endpoint,
                        message: error.message,
                    }),
                },
            ],
            isError: true,
        };
    }
}
/**
 * 创建带认证的请求头
 * @param token 认证令牌
 * @param userAgent 用户代理字符串
 * @returns 认证头对象
 */
export function createAuthHeaders(token, userAgent) {
    return {
        Authorization: token,
        "user-agent": userAgent,
        "x-dao-ua": userAgent,
    };
}
