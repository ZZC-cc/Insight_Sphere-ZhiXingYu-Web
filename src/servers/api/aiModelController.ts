// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 新增 AI 模型信息 POST /api/ai/model/create */
export async function createModelUsingPost(
  body: API.CreateModelRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/model/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 AI 模型信息 DELETE /api/ai/model/delete/${param0} */
export async function deleteModelUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteModelUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseboolean>(`/api/ai/model/delete/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据模型名称返回平台id GET /api/ai/model/getPlatformIdByModelName */
export async function getPlatformIdByModelNameUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlatformIdByModelNameUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponselong>(
    "/api/ai/model/getPlatformIdByModelName",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取所有 AI 模型信息 GET /api/ai/model/list */
export async function listModelsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAIModel>("/api/ai/model/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 根据平台id获取对应 AI 模型信息 GET /api/ai/model/listByPlatformId */
export async function listModelsByPlatformIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listModelsByPlatformIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListAIModel>(
    "/api/ai/model/listByPlatformId",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 更新 AI 模型信息 PUT /api/ai/model/update */
export async function updateModelUsingPut(
  body: API.AIModel,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/model/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
