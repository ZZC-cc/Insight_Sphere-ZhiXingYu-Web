// @ts-ignore
/* eslint-disable */
import request from "../../utils/request.ts";

/** createScore POST /api/score/create */
export async function createScoreUsingPost(
  body: API.ScoreCreateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/score/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteScore POST /api/score/delete */
export async function deleteScoreUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/score/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllScoreVO POST /api/score/get/all/vo */
export async function getAllScoreVoUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListScoreVO>("/api/score/get/all/vo", {
    method: "POST",
    ...(options || {}),
  });
}

/** getMyScoreVO POST /api/score/get/my/all/vo */
export async function getMyScoreVoUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListScoreVO>("/api/score/get/my/all/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** searchScore POST /api/score/search */
export async function searchScoreUsingPost(
  body: API.SearchRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListScoreVO>("/api/score/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** updateScore POST /api/score/update */
export async function updateScoreUsingPost(
  body: API.ScoreUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsestring>("/api/score/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
