// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** getChatMessages GET /api/chat/${param0}/messages */
export async function getChatMessagesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatMessagesUsingGETParams,
  options?: { [key: string]: any }
) {
  const { sessionId: param0, ...queryParams } = params;
  return request<API.BaseResponseListChatMessage>(
    `/api/chat/${param0}/messages`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** createChat POST /api/chat/create */
export async function createChatUsingPost(
  body: API.CreateChatRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseChatSession>("/api/chat/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteChatSession POST /api/chat/delete */
export async function deleteChatSessionUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/chat/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** sendMessage POST /api/chat/message */
export async function sendMessageUsingPost(
  body: API.UserMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** renameChatSession POST /api/chat/rename */
export async function renameChatSessionUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/chat/rename", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getChatSessions GET /api/chat/sessions */
export async function getChatSessionsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatSessionsUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListChatSession>("/api/chat/sessions", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateChatModel POST /api/chat/updateModel */
export async function updateChatModelUsingPost(
  body: API.UpdateChatModelRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/chat/updateModel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
