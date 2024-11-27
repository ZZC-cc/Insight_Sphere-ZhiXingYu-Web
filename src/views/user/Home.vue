<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <Navbar />
    <!-- 主内容区域 -->
    <div class="content">
      <router-view />
    </div>
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/views/user/common/Navbar.vue";
import Footer from "@/views/user/common/Footer.vue";
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 98vh; /* 页面最小高度为视口高度，确保页面至少覆盖整个视口 */
}

.content {
  flex: 1; /* 内容区域占用剩余空间 */
  box-sizing: border-box; /* 让 padding 算入元素的高度中 */
  overflow: auto; /* 确保内容溢出时可以滚动 */
}

.footer {
  flex-shrink: 0; /* 确保页脚不会因为内容区域的增大而缩小 */
  background-color: rgba(208, 238, 244, 0.11);
  border-top: 1px solid rgba(199, 199, 199, 0.8);
  text-align: center; /* 页脚文本居中 */
}
</style>
