// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** addView GET /api/home/add */
export async function addViewUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>("/api/home/add", {
    method: "GET",
    ...(options || {}),
  });
}

/** getHome GET /api/home/get/vo */
export async function getHomeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseHomeVO>("/api/home/get/vo", {
    method: "GET",
    ...(options || {}),
  });
}
