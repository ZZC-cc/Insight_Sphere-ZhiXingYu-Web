// 在你的项目中创建一个 umi-request 的自定义配置文件，比如 requestConfig.ts

import { extend } from "umi-request";
import { message } from "ant-design-vue";
import router from "../router";

// 扩展 umi-request 实例
const request = extend({
  // 设置默认的配置
  timeout: 30000,
  headers: {
    // "Content-Type": "application/json",
  },
  // errorHandler: (error) => {
  //   // 统一的错误处理
  //   if (error.response) {
  //     message.error(`请求错误 ${error.response.status}: ${error.response.url}`);
  //   }
  //   throw error; // 抛出错误，保证可以在调用方捕获到
  // },
});

// 添加请求拦截器，自动附加 Authorization 头部
request.interceptors.request.use((url, options) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return {
    url,
    options: { ...options, headers },
  };
});

// 添加响应拦截器，处理返回结果
request.interceptors.response.use(async (response, options) => {
  const res = await response.clone().json(); // 克隆响应以读取 JSON 数据
  if (res.code === 402 || res.message == "获取用户信息失败") {
    message.warn("登录已过期，请重新登录！");
    // 清除本地存储中的 token
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    // 跳转到登录页面
    router.push("/login");
  } else if (res.code && res.code !== 200) {
    // 处理其他非 200 的错误
    message.error(res.message || "请求失败");
    throw new Error(res.message || "请求失败");
  }
  return response; // 返回响应，保证可以在调用方继续处理
});

export default request;
