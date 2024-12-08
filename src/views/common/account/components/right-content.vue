<script setup lang="ts">
import { ref } from "vue";
import OrderTab from "@/views/common/account/components/order-tab.vue";
import PostTab from "@/views/common/account/components/post-tab.vue";
import FavoriteTab from "@/views/common/account/components/favorite-tab.vue";

// const { t } = useI18n()

const activeKey = ref();
</script>

<template>
  <a-card :borderer="false">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="我的订单" force-render>
        <order-tab />
      </a-tab-pane>
      <a-tab-pane key="3" tab="我的帖子" force-render>
        <post-tab />
      </a-tab-pane>
      <a-tab-pane key="2" tab="我的收藏" force-render>
        <favorite-tab />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<style scoped lang="less">
:deep(.ant-list-item) {
  flex-direction: column !important;
  align-items: normal !important;
}

:deep(.ant-btn) {
  padding-left: 0;
}
</style>
