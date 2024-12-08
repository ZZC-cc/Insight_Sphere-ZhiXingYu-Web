// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 获取极验初始化信息 GET /api/auth/geetest/register */
export async function initGeetestUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseobject>("/api/auth/geetest/register", {
    method: "GET",
    ...(options || {}),
  });
}

/** sendResetCodeForLogin POST /api/auth/login/sendResetCode */
export async function sendResetCodeForLoginUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendResetCodeForLoginUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/auth/login/sendResetCode", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** sendResetCodeForRegister POST /api/auth/register/sendResetCode */
export async function sendResetCodeForRegisterUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendResetCodeForRegisterUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/auth/register/sendResetCode", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** resetPassword POST /api/auth/resetPassword */
export async function resetPasswordUsingPost(
  body: API.ResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/auth/resetPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** sendResetCode POST /api/auth/sendResetCode */
export async function sendResetCodeUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.sendResetCodeUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/auth/sendResetCode", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
