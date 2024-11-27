// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 创建任务 POST /api/task/add */
export async function addTaskUsingPost(
  body: API.TaskAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/task/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 条件筛选 POST /api/task/condition */
export async function searchTaskByConditionUsingPost(
  body: API.TaskCategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTaskVO>("/api/task/condition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除任务 POST /api/task/delete */
export async function deleteTaskUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/task/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取任务统计数据 POST /api/task/get/task/data */
export async function getTaskDataUsingPost(
  body: API.TaskGetUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseTaskDataVO>("/api/task/get/task/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据状态获取任务 POST /api/task/get/task/status */
export async function getTaskByStatusUsingPost(
  body: API.TaskGetStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTaskVO>("/api/task/get/task/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取个人的全部任务 POST /api/task/get/task/user */
export async function getTaskByUserUsingPost(
  body: API.TaskGetUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTaskVO>("/api/task/get/task/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取任务VO列表 POST /api/task/list/vo */
export async function listTaskUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListTaskVO>("/api/task/list/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** 多类型搜索 POST /api/task/search */
export async function searchTaskUsingPost(
  body: API.TaskSearchRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListTaskVO>("/api/task/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新任务 POST /api/task/update */
export async function updateTaskUsingPost(
  body: API.TaskUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/task/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
