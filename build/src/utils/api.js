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
            const formData = new FormData();
            formData.append("file", file);
            if (data) {
                Object.keys(data).forEach((key) => {
                    formData.append(key, data[key]);
                });
            }
            data = formData;
            headers = { ...headers, ...formData.getHeaders() };
        }
        const response = await axios({
            method,
            url: `${API_BASE_URL}${endpoint}`,
            headers,
            data,
        });
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
