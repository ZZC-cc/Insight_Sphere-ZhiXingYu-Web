<template>
  <div
    style="
      background-color: #fff;
      width: 100%;
      margin-top: -30px;
      padding: 10px 0;
    "
  >
    <a-breadcrumb class="breadcrumb" mt6 ml6>
      <a-breadcrumb-item>首页</a-breadcrumb-item>
      <a-breadcrumb-item
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
      >
        {{ breadcrumb }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <!-- 显示最后一个面包屑 -->
    <h2 style="color: #303030; margin-bottom: 10px" ml6>
      {{ lastBreadcrumb }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

// 获取当前路由实例
const route = useRoute();

// 计算面包屑路径
const breadcrumbs = computed(() => {
  return route.matched
    .filter((route) => route.meta && route.meta.breadcrumb)
    .map((route) => route.meta.breadcrumb);
});

// 计算最后一个面包屑名称
const lastBreadcrumb = computed(() => {
  return breadcrumbs.value[breadcrumbs.value.length - 1] || "无";
});
</script>

<style scoped></style>
