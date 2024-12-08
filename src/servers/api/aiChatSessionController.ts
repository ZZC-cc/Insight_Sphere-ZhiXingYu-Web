// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** deleteSession DELETE /api/ai/chat/session/${param0} */
export async function deleteSessionUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSessionUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseint>(`/api/ai/chat/session/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** createSession POST /api/ai/chat/session/create */
export async function createSessionUsingPost(
  body: API.CreateSessionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponselong>("/api/ai/chat/session/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getUserSessions POST /api/ai/chat/session/list */
export async function getUserSessionsUsingPost(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListAIChatSessionVO>(
    "/api/ai/chat/session/list",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** updateSession PUT /api/ai/chat/session/update */
export async function updateSessionUsingPut(
  body: API.AIChatSessionVO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/chat/session/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** updateSessionName POST /api/ai/chat/session/update/name */
export async function updateSessionNameUsingPost(
  body: API.AIChatSessionVO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/ai/chat/session/update/name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
