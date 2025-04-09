import { makeApiRequest, createAuthHeaders } from "../../utils/api.js";
import { z } from "zod";
import { authParams } from "../../types/index.js";
/**
 * 注册存储相关工具
 * @param server MCP服务器实例
 */
export function registerStorageTools(server) {
    /**
     * 存储空间单key值查询
     */
    server.tool("storage.get", "存储空间单key值查询", {
        key: z.string().describe("存储空间key，key(length<=1000)"),
        mapId: z.string().describe("地图id(扩展地图为主图id)"),
        storageName: z
            .string()
            .describe("操作空间名(length<=50 && ^[a-zA-Z0-9_]+$)"),
        isGroup: z
            .boolean()
            .describe("是否为扩展地图组（缺省：false）")
            .optional(),
        ...authParams,
    }, async ({ key, mapId, storageName, isGroup, token, userAgent }, extra) => {
        const headers = createAuthHeaders(token, userAgent);
        return await makeApiRequest(`/storage`, "GET", headers, {
            key,
            mapId,
            storageName,
            isGroup,
        });
    });
    /**
     * 存储空间单key值写入/更新
     */
    server.tool("storage.set", "存储空间单key值写入/更新", {
        key: z.string().describe("存储空间key，key(length<=1000)"),
        mapId: z.string().describe("地图id(扩展地图为主图id)"),
        storageName: z
            .string()
            .describe("操作空间名(length<=50 && ^[a-zA-Z0-9_]+$)"),
        isGroup: z
            .boolean()
            .describe("是否为扩展地图组（缺省：false）")
            .optional(),
        value: z
            .string()
            .describe('json字符串值(json, size<=2MB)，格式必须是{"content": value}，value为用户输入的内容'),
        ...authParams,
    }, async ({ key, mapId, storageName, isGroup, value, token, userAgent }, extra) => {
        const headers = createAuthHeaders(token, userAgent);
        return await makeApiRequest(`/storage`, "POST", headers, {
            key,
            mapId,
            storageName,
            isGroup,
            value,
        });
    });
    /**
     * 存储空间单key值删除
     */
    server.tool("storage.remove", "存储空间单key值删除", {
        key: z.string().describe("存储空间key，key(length<=1000)"),
        mapId: z.string().describe("地图id(扩展地图为主图id)"),
        storageName: z
            .string()
            .describe("操作空间名(length<=50 && ^[a-zA-Z0-9_]+$)"),
        isGroup: z
            .boolean()
            .describe("是否为扩展地图组（缺省：false）")
            .optional(),
        ...authParams,
    }, async ({ key, mapId, storageName, isGroup, token, userAgent }, extra) => {
        const headers = createAuthHeaders(token, userAgent);
        return await makeApiRequest(`/remove`, "DELETE", headers, {
            key,
            mapId,
            storageName,
            isGroup,
        });
    });
    /**
     * 存储空间分页查询
     */
    server.tool("storage.page", "存储空间分页查询", {
        mapId: z.string().describe("地图id(扩展地图为主图id)"),
        constraint: z
            .object({
            ascending: z
                .boolean()
                .describe("是否升序，true：升序，false：降序, 缺省：不排序")
                .optional(),
            max: z
                .number()
                .describe("限定查询最大值(<=)，缺省：不限制")
                .optional(),
            min: z
                .number()
                .describe("限定查询最小值(>=)，缺省：不限制")
                .optional(),
            target: z
                .string()
                .describe("约束目标值的路径(a.b.c)，当值是JSON格式时，指定用作排序的值的路径。例如传入 score时，会取值上score属性的值作为排序、最大最小值的限制目标")
                .optional(),
        })
            .optional(),
        storageName: z
            .string()
            .describe("操作空间名(length<=50 && ^[a-zA-Z0-9_]+$)"),
        isGroup: z
            .boolean()
            .describe("是否为扩展地图组（缺省：false）")
            .optional(),
        limit: z.number().describe("查询数量(缺省：10，最大：100)").optional(),
        offset: z.number().describe("偏移量(缺省：0)").optional(),
        ...authParams,
    }, async ({ mapId, storageName, isGroup, constraint, limit, offset, token, userAgent, }, extra) => {
        const headers = createAuthHeaders(token, userAgent);
        return await makeApiRequest(`/storage/page`, "GET", headers, {
            mapId,
            storageName,
            isGroup,
            constraint,
            limit,
            offset,
        });
    });
    /**
     * 数据结构设计提示
     */
    server.prompt("storage.designSchema", "为游戏存储设计数据结构", {
        gameFeatures: z.string().describe("游戏功能描述"),
        dataRequirements: z
            .string()
            .describe("数据存储需求，用逗号分隔")
            .optional(),
    }, (params) => {
        const { gameFeatures, dataRequirements } = params;
        let prompt = `请为以下游戏功能设计合适的键值对数据存储结构：\n\n${gameFeatures}\n\n`;
        if (dataRequirements) {
            prompt += "数据需求：\n";
            const reqList = dataRequirements.split(",").map((item) => item.trim());
            reqList.forEach((req, index) => {
                prompt += `${index + 1}. ${req}\n`;
            });
            prompt += "\n";
        }
        prompt +=
            "请设计：\n1. 存储空间的名称和用途\n2. 各个key的命名和结构\n3. JSON格式的数据示例\n4. 数据读写操作的建议";
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
    });
    /**
     * 数据查询优化提示
     */
    server.prompt("storage.optimizeQuery", "优化存储数据查询", {
        queryDescription: z.string().describe("查询需求描述"),
        currentImplementation: z.string().describe("当前实现方式").optional(),
        dataStructure: z.string().describe("数据结构描述").optional(),
    }, (params) => {
        const { queryDescription, currentImplementation, dataStructure } = params;
        let prompt = `请优化以下键值对数据查询方案：\n\n${queryDescription}\n\n`;
        if (currentImplementation) {
            prompt += `当前实现方式：\n${currentImplementation}\n\n`;
        }
        if (dataStructure) {
            prompt += `数据结构：\n${dataStructure}\n\n`;
        }
        prompt +=
            "请提供：\n1. 优化后的查询方案\n2. 查询性能分析\n3. 数据结构的优化建议（如果需要）\n4. 使用神岛引擎存储API的最佳实践";
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
    });
}
