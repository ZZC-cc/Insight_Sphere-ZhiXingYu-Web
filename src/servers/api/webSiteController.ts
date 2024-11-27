// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** getWebsiteDetails GET /api/website/details */
export async function getWebsiteDetailsUsingGet(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseWebsiteVO>("/api/website/details", {
    method: "GET",
    ...(options || {}),
  });
}

/** updateWebsiteDetails PUT /api/website/update */
export async function updateWebsiteDetailsUsingPut(
  body: API.WebsiteVO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/website/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
