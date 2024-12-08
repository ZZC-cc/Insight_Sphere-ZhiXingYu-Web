// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** getHome GET /api/home/get/vo */
export async function getHomeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseHomeVO>("/api/home/get/vo", {
    method: "GET",
    ...(options || {}),
  });
}
