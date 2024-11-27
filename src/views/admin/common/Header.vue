<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserInfoUsingGet } from "@/servers/api/userController.ts";
import UserVO = API.UserVO;
import router from "@/router";
import { message } from "ant-design-vue";

const User = ref(<UserVO>[]);

onMounted(async () => {
  //获取用户信息
  await getUserInfoUsingGet({}).then((res) => {
    User.value = res.data;
  });
});

// 处理个人中心点击
const handleProfile = () => {
  router.push("/settings/profile");
};

// 处理退出登录点击
const handleLogout = () => {
  // 清除存储的 token 和用户信息
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  // 跳转到登录页
  router.push("/login");
};
</script>

<template>
  <!-- 顶部导航栏 -->
  <div class="header">
    <div>
      <a-dropdown>
        <span class="text-16px color-gray600 font-550 float-right p2">
          <a-avatar
            style="
              background-color: #87d068;
              margin-right: 10px;
              margin-top: -5px;
            "
            size="large"
            :src="User.avatar"
          /><span mr2>{{ User.name }}</span></span
        >
        <template v-slot:overlay>
          <a-menu w-90px style="margin-left: 50px">
            <a-menu-item key="profile">
              <a @click="handleProfile">个人中心</a>
            </a-menu-item>
            <a-menu-item key="user">
              <a @click="router.push('/')">网站首页</a>
            </a-menu-item>
            <a-menu-item key="logout">
              <a @click="handleLogout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding: 14px;
  background: rgb(255, 255, 255);
  border: solid 1px rgba(232, 232, 232, 0.53);
}
</style>
