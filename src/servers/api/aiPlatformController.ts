// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 新增 AI 平台信息 POST /api/ai/platform/create */
export async function createPlatformUsingPost(
  body: API.AIPlatform,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/platform/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 AI 平台信息 DELETE /api/ai/platform/delete/${param0} */
export async function deletePlatformUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePlatformUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseboolean>(`/api/ai/platform/delete/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id获取平台消息 GET /api/ai/platform/get/${param0} */
export async function getPlatformByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlatformByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseAIPlatform>(`/api/ai/platform/get/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取所有 AI 平台信息 GET /api/ai/platform/list */
export async function listPlatformsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAIPlatform>("/api/ai/platform/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** 更新 AI 平台信息 PUT /api/ai/platform/update */
export async function updatePlatformUsingPut(
  body: API.AIPlatform,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/platform/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
