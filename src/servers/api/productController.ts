// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 添加教程 POST /api/product/add */
export async function addProductUsingPost(
  body: API.ProductAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/product/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 切换教程上下架状态 GET /api/product/change/shelves */
export async function changeShelvesUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.changeShelvesUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/product/change/shelves", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除教程 POST /api/product/delete */
export async function deleteProductUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/product/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取全部标签名称 GET /api/product/get/all/tags */
export async function getAllTagsUsingGet1(options?: { [key: string]: any }) {
  return request<API.BaseResponseListstring>("/api/product/get/all/tags", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取所有教程VO列表 POST /api/product/get/all/vo */
export async function getAllProductVoUsingPost(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListProductVO>("/api/product/get/all/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** 通过标签名称获取教程列表 GET /api/product/get/products/by/tags */
export async function getProductsByTagsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductsByTagsUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListProductVO>(
    "/api/product/get/products/by/tags",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 获取教程详情 GET /api/product/get/vo */
export async function getProductByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProductByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseProductVO>("/api/product/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 多类型搜索 GET /api/product/search */
export async function searchProductBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchProductBySearchTextUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListProductVO>("/api/product/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新教程 POST /api/product/update */
export async function updateProductUsingPost(
  body: API.ProductUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/product/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
