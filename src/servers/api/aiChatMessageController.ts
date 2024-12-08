// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** sendMessage POST /api/ai/chat/message/${param0} */
export async function sendMessageUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendMessageUsingPOSTParams,
  body: API.AIChatRequest,
  options?: { [key: string]: any }
) {
  const { sessionId: param0, ...queryParams } = params;
  return request<API.BaseResponseAIChatResponse>(
    `/api/ai/chat/message/${param0}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** clearMessages DELETE /api/ai/chat/message/${param0} */
export async function clearMessagesUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.clearMessagesUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { sessionId: param0, ...queryParams } = params;
  return request<API.BaseResponseboolean>(`/api/ai/chat/message/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** getMessages POST /api/ai/chat/message/detail */
export async function getMessagesUsingPost(
  body: API.GetMessageRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListAIChatMessage>(
    "/api/ai/chat/message/detail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** search POST /api/ai/chat/search */
export async function searchUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/ai/chat/search", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
