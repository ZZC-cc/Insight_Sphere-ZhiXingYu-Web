// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** addComment POST /api/comment/add */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/comment/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllComments GET /api/comment/all */
export async function getAllCommentsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListCommentVO>("/api/comment/all", {
    method: "GET",
    ...(options || {}),
  });
}

/** deleteComment POST /api/comment/delete */
export async function deleteCommentUsingPost(
  body: API.CommentDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/comment/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getCommentsByPostId GET /api/comment/getByPostId/${param0} */
export async function getCommentsByPostIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentsByPostIdUsingGETParams,
  options?: { [key: string]: any }
) {
  const { postId: param0, ...queryParams } = params;
  return request<API.BaseResponseListCommentVO>(
    `/api/comment/getByPostId/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** getAllCommentsList GET /api/comment/list */
export async function getAllCommentsListUsingGet(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListCommentVO>("/api/comment/list", {
    method: "GET",
    ...(options || {}),
  });
}

/** getCommentBySearchText GET /api/comment/search */
export async function getCommentBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentBySearchTextUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListCommentVO>("/api/comment/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
