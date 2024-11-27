<template>
  <div>
    <a-result
      status="success"
      title="支付成功"
      sub-title="订单支付已成功，请查看订单详情或返回首页。"
      style="margin-top: 48px"
    >
      <template #extra>
        <a-button type="primary" @click="viewOrderDetail">查看订单</a-button>
        <a-button @click="goHome">返回首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();

// 查看订单详情
const viewOrderDetail = () => {
  router.push(`/order`); // 跳转到订单详情页
};

// 返回首页
const goHome = () => {
  router.push("/");
};
</script>
