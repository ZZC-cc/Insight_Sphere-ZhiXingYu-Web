// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 创建用户 POST /api/user/create */
export async function userCreateUsingPost(
  body: API.CreateUserDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户接口 DELETE /api/user/delete/ */
export async function deleteUserUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserUsingDELETEParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/delete/", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 批量删除用户接口 DELETE /api/user/delete/users */
export async function deleteUsersUsingDelete(
  body: number[],
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/delete/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取极验初始化信息 GET /api/user/geetest/register */
export async function initGeetestUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseobject>("/api/user/geetest/register", {
    method: "GET",
    ...(options || {}),
  });
}

/** 根据分类类型获取用户接口 GET /api/user/get/all */
export async function getUsersByCategoryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersByCategoryUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListUser>("/api/user/get/all", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据 id 获取用户 GET /api/user/get/byId */
export async function getUserByUserIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserByUserIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUser>("/api/user/get/byId", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 多类型搜索接口 GET /api/user/get/search */
export async function getUsersBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersBySearchTextUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListUser>("/api/user/get/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前登录用户信息 GET /api/user/info */
export async function getUserInfoUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserVO>("/api/user/info", {
    method: "GET",
    ...(options || {}),
  });
}

/** 用户登录 POST /api/user/login */
export async function loginUsingPost(
  body: API.LoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVO>("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册用户 POST /api/user/register */
export async function userRegisterUsingPost(
  body: API.RegisterUserDto,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员更新用户资料接口 PUT /api/user/update/byAdmin */
export async function updateUserByAdminUsingPut(
  body: API.UpdateByAdminRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/update/byAdmin", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户更新个人资料接口 PUT /api/user/update/byUser */
export async function updateUserUserUsingPut(
  body: API.UpdateByUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/update/byUser", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改密码接口 POST /api/user/update/password */
export async function updatePasswordUsingPost(
  body: API.UpdatePasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/update/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
