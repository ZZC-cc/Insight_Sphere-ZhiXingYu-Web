<template>
  <div :class="['sidebar', { collapsed }]" style="border-radius: 20px">
    <!-- 侧边栏头部 -->
    <div class="sidebar-header" mt1 mb4>
      <img :src="Website.logo_url" alt="Logo" class="sidebar-logo" />
      <span class="sidebar-title" v-if="!collapsed">{{
        Website.site_name
      }}</span>
    </div>

    <!-- 动态生成的菜单 -->
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      theme="light"
      :items="menuItems"
      @click="handleMenuClick"
      class="menu"
      style="font-size: 15px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, h } from "vue";
import { useRouter, useRoute, RouteRecordRaw } from "vue-router";
import type { MenuProps, ItemType } from "ant-design-vue";
import {
  HomeOutlined,
  AppstoreOutlined,
  FileOutlined,
  MailOutlined,
  SettingOutlined,
  EditOutlined,
  UserOutlined,
  ControlOutlined,
  ReadOutlined,
  CommentOutlined,
  CodeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons-vue";
import { getWebsiteDetailsUsingGet } from "@/servers/api/webSiteController.ts";
import WebsiteVO = API.WebsiteVO;

// 接收折叠状态的 prop
const props = defineProps<{ collapsed: boolean }>();

const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const menuItems = ref<ItemType[]>([]);

// 路由实例
const router = useRouter();
const route = useRoute();

// 图标映射表
const iconMap: Record<string, any> = {
  ControlOutlined,
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileOutlined,
  MailOutlined,
  SettingOutlined,
  EditOutlined,
  ReadOutlined,
  CommentOutlined,
  CodeOutlined,
  CreditCardOutlined,
};

// 递归函数：生成菜单项
function generateMenuFromRoutes(
  routes: RouteRecordRaw[],
  basePath = ""
): ItemType[] {
  return routes.reduce((menuList: ItemType[], route) => {
    if (route.meta?.breadcrumb) {
      const fullPath = basePath + "/" + route.path; // 完整路径

      const menuItem: ItemType = {
        key: fullPath,
        icon: iconMap[route.meta.icon as string]
          ? () => h(iconMap[route.meta.icon as string])
          : null,
        label: route.meta.breadcrumb,
        children: route.children
          ? generateMenuFromRoutes(route.children, fullPath)
          : undefined,
      };
      menuList.push(menuItem);
    }
    return menuList;
  }, []);
}

const Website = ref(<WebsiteVO>[]);

onMounted(async () => {
  const res = await getWebsiteDetailsUsingGet();
  if (res.code == 200) {
    Website.value = res.data;
    console.log(res);
    console.log(Website);
  }
  const routes = router.options.routes;

  const adminRoutes = routes.find((route) => route.path === "/admin");
  if (adminRoutes?.children) {
    menuItems.value = generateMenuFromRoutes(adminRoutes.children, "/admin");
    console.log("生成的菜单项:", menuItems.value);
  } else {
    console.error("找不到 /admin 路由或其子路由");
  }

  // 初始化选中项和展开项
  updateMenuState(route.path);
});

// 更新菜单状态
function updateMenuState(currentPath: string) {
  const segments = currentPath.split("/").filter(Boolean);
  openKeys.value = segments.map(
    (_, index, arr) => "/" + arr.slice(0, index + 1).join("/")
  );
  selectedKeys.value = [currentPath];
}

// 监听路由变化，更新选中状态
watch(
  () => route.path,
  (newPath) => {
    updateMenuState(newPath);
  },
  { immediate: true }
);

// 菜单点击事件
const handleMenuClick: MenuProps["onClick"] = (e) => {
  selectedKeys.value = [e.key];
  router.push(e.key);
};
</script>

<style scoped>
.sidebar {
  width: 230px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
}

.sidebar-title {
  font-size: 22px;
  font-weight: bold;
  color: #303030;
  margin-left: 10px;
}

.menu {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
