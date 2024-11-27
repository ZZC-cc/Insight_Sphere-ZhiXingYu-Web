// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 创建通知接口 POST /api/notice/create */
export async function createUsingPost(
  body: API.CreateNoticeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/notice/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除通知接口 POST /api/notice/delete */
export async function deleteUsingPost(
  body: API.DeleteNoticeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/notice/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取最新通知接口 GET /api/notice/get/news */
export async function getNewsNoticeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseNotice>("/api/notice/get/news", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取通所有知接口 GET /api/notice/getAll */
export async function getAllNoticeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListNotice>("/api/notice/getAll", {
    method: "GET",
    ...(options || {}),
  });
}

/** 搜索通知接口 POST /api/notice/search */
export async function searchUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListNotice>("/api/notice/search", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据id切换状态接口 POST /api/notice/switchStatus */
export async function switchStatusUsingPost(
  body: number,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/notice/switchStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新通知接口 POST /api/notice/update */
export async function updateUsingPost(
  body: API.UpdateNoticeDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/notice/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
