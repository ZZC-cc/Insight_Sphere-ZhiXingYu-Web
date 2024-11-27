<template>
  <div class="layout">
    <!-- 折叠按钮 -->
    <button class="toggle-btn" @click="toggleCollapse">
      <template v-if="collapsed">
        <MenuUnfoldOutlined />
      </template>
      <template v-else>
        <MenuFoldOutlined />
      </template>
    </button>

    <!-- 侧边栏 -->
    <Menu :collapsed="collapsed" />

    <!-- 主体部分 -->
    <div class="main-layout">
      <Header />

      <!-- 动态内容显示 -->
      <div class="content">
        <Breadcrumb />
        <div style="background-color: #fff">
          <router-view />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Menu from "@/views/admin/common/Menu.vue";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import Header from "@/views/admin/common/Header.vue";
import Footer from "@/views/admin/common/Footer.vue";
import Breadcrumb from "@/views/admin/common/Breadcrumb.vue";

const collapsed = ref(false); // 控制菜单折叠状态

// 切换菜单的折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 98.75vh;
  margin: 0px;
}

.toggle-btn {
  position: fixed;
  bottom: 20px;
  left: 25px;
  z-index: 1000;
  background: #4096ff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
}

.main-layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.content {
  background: #f4f6f9;
  flex-grow: 1;
}
</style>
