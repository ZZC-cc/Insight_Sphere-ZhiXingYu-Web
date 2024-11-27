<template>
  <a-row class="navbar" :wrap="false">
    <!-- 网站Logo和名称 -->
    <a-col class="logo" span="4.5">
      <img :src="Website.logo_url" width="50px" @click="router.push('/')" />
      <span
        width="50px"
        @click="router.push('/')"
        style="margin-left: 10px; font-weight: 550; font-size: 24px"
      >
        {{ Website.site_name }}
      </span>
    </a-col>
    <a-col span="8.5">
      <!-- 自定义菜单 -->
      <nav class="custom-menu" :class="{ show: isMenuOpen }">
        <ul>
          <li
            v-for="item in items"
            :key="item.key"
            :class="{ active: item.key === current }"
            @click="!item.children && handleMenuClick(item)"
            @mouseenter="item.children && (item.isOpen = true)"
            @mouseleave="item.children && (item.isOpen = false)"
          >
            <span class="icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>

            <!-- 折叠子菜单 -->
            <ul v-if="item.children && item.isOpen" class="submenu">
              <li
                v-for="child in item.children"
                :key="child.key"
                @click.stop="handleMenuClick(child)"
              >
                {{ child.label }}
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </a-col>
    <!-- 用户信息 -->
    <a-col class="user-info" span="1.5">
      <!--      <a-input-search-->
      <!--        placeholder="搜索..."-->
      <!--        class="mr4"-->
      <!--        style="width: 200px"-->
      <!--        @search="onSearch"-->
      <!--      />-->
      <a-avatar
        style="color: #008bf5; background-color: #b5e6f0; float: right"
        size="large"
        :src="User.avatar"
      />
      <a-dropdown>
        <span class="text-16px color-gray600 font-550 p1">{{ User.name }}</span>
        <template v-slot:overlay>
          <a-menu>
            <a-menu-item key="profile">
              <a @click="handleProfile">个人中心</a>
            </a-menu-item>
            <a-menu-item key="admin" v-if="User.role === 'admin'">
              <a @click="router.push('/admin')">管理后台</a>
            </a-menu-item>
            <a-menu-item key="order">
              <a @click="router.push('/order')">我的订单</a>
            </a-menu-item>
            <a-menu-item key="logout">
              <a @click="handleLogout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserVO = API.UserVO;
import { message } from "ant-design-vue";
import WebsiteVO = API.WebsiteVO;

// 获取 Vue Router 实例
const router = useRouter();
const route = useRoute(); // 获取当前路由
const isMenuOpen = ref(false);
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});

console.log(User.value);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 当前选中的菜单项
const current = ref("");

// 自定义菜单项
const items = ref([
  { key: "home", label: "主页", icon: "🏠", url: "/" },
  { key: "app", label: "AI对话", icon: "🤖", url: "/AIChat" },
  { key: "post", label: "博客", icon: "📄", url: "/post" },
  { key: "product", label: "教程", icon: "🖥️", url: "/product" },
  { key: "Information", label: "资讯", icon: "🐳", url: "/Information" },
  // {
  //   key: "settings",
  //   label: "设置",
  //   icon: "⚙️",
  //   children: [
  //     { key: "profile", label: "个人设置", url: "/settings/profile" },
  //     { key: "security", label: "安全设置", url: "/settings/security" },
  //   ],
  //   isOpen: false,
  // },
  // { key: "link", label: "链接", icon: "🔗", url: "/admin" },
]);

// 菜单项点击事件
const handleMenuClick = (item: { key: string; url: string }) => {
  current.value = item.key;
  console.log("选中菜单项:", item.key);

  // 判断是内部链接还是外部链接
  if (item.url.startsWith("http")) {
    // 外部链接，使用新窗口打开
    window.open(item.url, "_blank");
  } else {
    // 内部链接，使用 Vue Router 进行导航
    router.push(item.url);
  }
};

// 搜索事件
const onSearch = (value: string) => {
  console.log("搜索内容:", value);
};

// 根据当前路由更新 `current` 的值
const updateCurrentMenu = () => {
  const matchedItem = items.value.find((item) => item.url === route.path);
  if (matchedItem) {
    current.value = matchedItem.key;
  } else {
    items.value.forEach((item) => {
      if (item.children) {
        const matchedChild = item.children.find(
          (child) => child.url === route.path
        );
        if (matchedChild) {
          current.value = matchedChild.key;
        }
      }
    });
  }
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateCurrentMenu();
  }
);

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

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 10px;
  padding: 10px 20px;
  border: 1px solid rgba(199, 199, 199, 0.8);
  border-radius: 5px;
  background-color: rgba(208, 238, 244, 0.11);
}

.logo {
  display: flex;
  align-items: center;
}

.custom-menu {
  display: flex;
  align-items: center;
  font-weight: 550;
  color: rgba(48, 48, 48, 0.9);
}

.custom-menu ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.custom-menu li {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  position: relative;
  transition: color 0.3s, border-bottom 0.3s;
}

.custom-menu li.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.custom-menu li:hover {
  color: #40a9ff;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100px;
  border-radius: 5px;
}

.submenu li {
  padding: 12px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.submenu li:hover {
  background-color: #f5f5f5;
}

.icon {
  font-size: 18px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .custom-menu {
    width: 100%;
    display: none;
    flex-direction: column;
  }

  .custom-menu ul {
    flex-direction: column;
    width: 100%;
  }

  .custom-menu li {
    width: 100%;
    justify-content: flex-start;
    padding: 10px;
  }

  .custom-menu.show {
    display: flex;
  }

  .user-info {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
  }

  .menu-toggle {
    display: block;
    cursor: pointer;
    font-size: 20px;
    margin-left: auto;
  }
}
</style>
