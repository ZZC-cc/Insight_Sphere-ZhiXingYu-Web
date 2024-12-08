<template>
  <div class="order-page">
    <div class="order-list" v-if="order.length > 0">
      <a-card
        v-for="item in order"
        :key="item.id"
        class="order-card"
        bordered
        hoverable
        mb2
      >
        <template #title> 订单号：{{ item.id }}</template>
        <div class="card-content">
          <div class="product-image-container">
            <img
              :src="item.product.images"
              class="product-image"
              alt="product"
            />
          </div>
          <div class="info-section" ml5>
            <h3 class="product-title">{{ item.product.title }}</h3>
            <p class="product-description">{{ item.product.description }}</p>
            <div class="order-status">
              <span style="color: #909090" mr2>订单状态：</span>
              <a-tag
                v-if="item.status === 1"
                color="success"
                class="status-tag"
              >
                已支付
              </a-tag>
              <a-tag
                v-else-if="item.status === 0"
                color="warning"
                class="status-tag"
              >
                未支付
              </a-tag>
              <a-button
                v-if="item.status == 0"
                type="link"
                @click="pay(item.id)"
                >去支付>
              </a-button>
            </div>
            <div class="order-status" mt1>
              <span style="color: #909090; line-height: 26px" mr2
                >支付方式：</span
              >
              <AlipayCircleOutlined style="color: #4a64fb; font-size: 26px" />
            </div>
            <div class="order-status" mt1>
              <span style="color: #909090; line-height: 26px" mr2
                >下单时间：</span
              >
              {{ formatDate(item.createTime) }}
            </div>
            <div class="order-status" mt1>
              <span style="color: #909090; line-height: 26px" mr2
                >支付时间：</span
              >
              {{ formatDate(item.payTime) }}
            </div>
            <p class="price">
              总金额：<span class="highlight">￥{{ item.money }}</span>
              <a-button
                type="primary"
                @click="viewProduct(item.product.id)"
                class="view-button"
              >
                <span ml3>查看商品</span>
              </a-button>
            </p>
          </div>
        </div>
      </a-card>
    </div>
    <div v-else>
      <a-empty />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { getAllMyOrderVoUsingPost } from "@/servers/api/orderController.ts";
import OrderVO = API.OrderVO;
import { useRouter } from "vue-router";
import { AlipayCircleOutlined } from "@ant-design/icons-vue";

const order = ref<OrderVO[]>([]);
const router = useRouter();

const pay = (orderId: string) => {
  window.location.replace(`http://localhost:9666/api/alipay/pay/${orderId}`);
};

// 获取订单数据
const getOrderList = async () => {
  try {
    const response = await getAllMyOrderVoUsingPost();
    if (response.code == 200) {
      order.value = response.data;
    } else {
      message.error("加载订单失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return "暂无时间信息";
  return new Date(dateString).toLocaleString();
};

// 查看商品详情
const viewProduct = (productId: string) => {
  router.push(`/product/${productId}`);
};

// 页面加载时获取订单列表
onMounted(() => {
  getOrderList();
});
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.order-list {
  gap: 20px;
}

.order-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.order-card:hover {
  transform: scale(1.02);
}

.card-content {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.product-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.info-section {
  flex: 1.4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.product-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

.order-status {
  margin-bottom: 8px;
}

.price {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.highlight {
  color: #ff4d4f;
}

.time {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.view-button {
  align-self: flex-start;
  float: right;
  margin-right: 40px;
}
</style>
