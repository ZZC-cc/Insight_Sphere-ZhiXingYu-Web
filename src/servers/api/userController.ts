// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 验证邮箱是否存在接口 GET /api/user/check/email */
export async function checkEmailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkEmailUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/user/check/email", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 验证手机号是否存在接口 GET /api/user/check/phone */
export async function checkPhoneUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkPhoneUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/user/check/phone", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

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

/** 邮箱登录 POST /api/user/login/email */
export async function loginByEmailUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loginByEmailUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseUserVO>("/api/user/login/email", {
    method: "POST",
    params: {
      ...params,
    },
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

/** 开通会员 POST /api/user/vip/open */
export async function openVipUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.openVipUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/user/vip/open", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
