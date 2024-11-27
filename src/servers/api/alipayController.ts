// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** notify POST /api/alipay/notify */
export async function notifyUsingPost(options?: { [key: string]: any }) {
  return request<string>("/api/alipay/notify", {
    method: "POST",
    ...(options || {}),
  });
}

/** pay GET /api/alipay/pay/${param0} */
export async function payUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payUsingGETParams,
  options?: { [key: string]: any }
) {
  const { orderId: param0, ...queryParams } = params;
  return request<any>(`/api/alipay/pay/${param0}`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** returnPage GET /api/alipay/return */
export async function returnPageUsingGet(options?: { [key: string]: any }) {
  return request<any>("/api/alipay/return", {
    method: "GET",
    ...(options || {}),
  });
}
