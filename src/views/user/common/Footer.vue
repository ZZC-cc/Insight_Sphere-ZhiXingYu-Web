<template>
  <a-layout-footer class="footer">
    <!-- 页脚Logo和网站名称 -->
    <div class="footer-logo">
      <img :src="Website.logo_url" alt="logo" width="50px" />
      <span class="site-name">{{ Website.site_name }}</span>
    </div>

    <!-- 页脚链接 -->
    <nav class="footer-menu">
      <ul>
        <li v-for="link in footerLinks" :key="link.key">
          <a :href="link.url" target="_blank" class="footer-link">{{
            link.label
          }}</a>
        </li>
      </ul>
    </nav>

    <!-- 页脚版权信息 -->
    <div class="footer-info">
      <span>{{ Website.footer_info }}</span>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getWebsiteDetailsUsingGet } from "@/servers/api/webSiteController.ts";
import WebsiteVO = API.WebsiteVO;

import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});

// 页脚链接项
const footerLinks = ref([
  { key: "about", label: "关于我们", url: "/about" },
  { key: "privacy", label: "隐私政策", url: "/privacy" },
  { key: "terms", label: "服务条款", url: "/terms" },
  { key: "contact", label: "联系我们", url: "/contact" },
  { key: "help", label: "帮助中心", url: "/help" },
]);
</script>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px 0px 40px;
  background-color: rgba(208, 238, 244, 0.11);
  border-top: 1px solid rgba(199, 199, 199, 0.8);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-name {
  font-size: 18px;
  color: #303030;
  font-weight: 700;
}

.footer-menu {
  display: flex;
  align-items: center;
}

.footer-menu ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  gap: 16px;
}

.footer-menu li {
  display: inline-block;
}

.footer-link {
  font-size: 16px;
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #d4d4d4;
}

.footer-info {
  font-size: 14px;
  color: #666;
}
</style>
