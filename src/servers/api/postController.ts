// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** 创建帖子 POST /api/post/add */
export async function addPostUsingPost(
  body: API.PostAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除帖子 POST /api/post/delete */
export async function deletePostUsingPost(
  body: API.PostDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 文章收藏/取消收藏 POST /api/post/favour */
export async function favourPostUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.favourPostUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/favour", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 生成文章内容 POST /api/post/generateContent */
export async function generateContentUsingPost(
  body: API.PostGenerateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 生成文章总结 POST /api/post/generateSummary */
export async function generateSummaryUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.generateSummaryUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/generateSummary", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取全部标签名称 GET /api/post/get/all/tags */
export async function getAllTagsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListstring>("/api/post/get/all/tags", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取总条数 GET /api/post/get/total */
export async function getTotalUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseint>("/api/post/get/total", {
    method: "GET",
    ...(options || {}),
  });
}

/** 通过id获取文章 GET /api/post/get/vo */
export async function getPostVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePostVO>("/api/post/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 文章浏览量+1 POST /api/post/incrementView/${param0} */
export async function incrementViewUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.incrementViewUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { postId: param0, ...queryParams } = params;
  return request<API.BaseResponsestring>(`/api/post/incrementView/${param0}`, {
    method: "POST",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取帖子列表 POST /api/post/list/all */
export async function getAllPostsUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListPostVO>("/api/post/list/all", {
    method: "POST",
    ...(options || {}),
  });
}

/** 根据标签获取文章 GET /api/post/list/by/tag */
export async function listPostsByTagUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPostsByTagUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPostVO>("/api/post/list/by/tag", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页获取文章列表 GET /api/post/list/page */
export async function listPagedPostsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPagedPostsUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPostVO>("/api/post/list/page", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 按字段排序帖子 POST /api/post/list/sorted */
export async function listSortedPostsUsingPost(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPostVO>("/api/post/list/sorted", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前用户创建的资源列表 POST /api/post/my/list/vo */
export async function listMyPostVoUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListPostVO>("/api/post/my/list/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** 多类型搜索 GET /api/post/search */
export async function searchPostBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchPostBySearchTextUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPostVO>("/api/post/search", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 搜索帖子（ES） POST /api/post/search/es */
export async function searchPostFromEsUsingPost(
  body: API.PostQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPostVO>("/api/post/search/es", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 文章点赞/取消点赞 POST /api/post/thumb */
export async function thumbPostUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.thumbPostUsingPOSTParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/thumb", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新帖子 POST /api/post/update */
export async function updatePostUsingPost(
  body: API.PostUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/post/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
