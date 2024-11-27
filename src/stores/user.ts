import UserVO = API.UserVO;
import WebsiteVO = API.WebsiteVO;
import { defineStore } from "pinia";
import { computed, onMounted, shallowRef } from "vue";
import { getWebsiteDetailsUsingGet } from "../servers/api/webSiteController.ts";
import { getUserInfoUsingGet } from "../servers/api/userController.ts";
import router from "../router";
import { message } from "ant-design-vue";

export const useUserStore = defineStore("user", () => {
  // 用户信息
  const userVO = shallowRef<UserVO>();
  // 网站信息
  const websiteVO = shallowRef<WebsiteVO>();

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    const res = await getUserInfoUsingGet();
    userVO.value = res.data;
  };

  /**
   * 获取网站信息
   */
  const getWebsiteInfo = async () => {
    const res = await getWebsiteDetailsUsingGet();
    websiteVO.value = res.data;
  };

  /**
   * 退出登录
   */
  const logout = async () => {
    try {
      // 清除存储的 token 和用户信息
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      userVO.value = null;
      // 跳转到登录页
      await router.push("/login");
    } catch (error) {
      console.error("登出失败", error);
    }
  };

  /**
   * 是否已登录
   */
  const isLoggedIn = computed(() => !!userVO.value);

  return {
    userVO,
    websiteVO,
    getUserInfo,
    getWebsiteInfo,
    logout,
    isLoggedIn,
  };
});
