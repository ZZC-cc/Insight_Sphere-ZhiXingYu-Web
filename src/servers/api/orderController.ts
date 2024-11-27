// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** createOrder POST /api/order/create */
export async function createOrderUsingPost(
  body: API.OrderCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponselong>("/api/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** createVipOrder POST /api/order/create/vip */
export async function createVipOrderUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.createVipOrderUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseboolean>("/api/order/create/vip", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteOrder POST /api/order/delete */
export async function deleteOrderUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/order/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllOrderVO POST /api/order/get/all/vo */
export async function getAllOrderVoUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListOrderVO>("/api/order/get/all/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** getAllMyOrderVO POST /api/order/get/my/all/vo */
export async function getAllMyOrderVoUsingPost(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListOrderVO>("/api/order/get/my/all/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** getOrderVOById GET /api/order/get/vo */
export async function getOrderVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseOrderVO>("/api/order/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** searchOrderBySearchText GET /api/order/search */
export async function searchOrderBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchOrderBySearchTextUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListOrderVO>("/api/order/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updatePayStatus POST /api/order/update/pay/status */
export async function updatePayStatusUsingPost(
  body: API.OrderUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/order/update/pay/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
