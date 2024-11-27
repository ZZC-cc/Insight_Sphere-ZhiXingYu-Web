<template>
  <div class="post-detail">
    <a-page-header
      title="返回"
      @back="() => $router.go(-1)"
      :sub-title="product?.title || '加载中...'"
    >
    </a-page-header>
    <div v-if="product">
      <a-card>
        <a-row>
          <a-col span="8">
            <img
              :src="product.images"
              width="100%"
              style="border-radius: 10px"
            />
          </a-col>
          <a-col span="16">
            <div style="padding: 0 20px">
              <span style="font-weight: 550; font-size: 26px">
                {{ product.title }}
              </span>
              <span ml3>
                <a-tag color="orange" v-if="product.type == '会员免费'"
                  >{{ product.type }}
                </a-tag>
                <a-tag color="blue" v-if="product.type == '免费'"
                  >{{ product.type }}
                </a-tag>
                <a-tag color="red" v-if="product.type == '付费'"
                  >{{ product.type }}
                </a-tag>
              </span>
            </div>
            <div style="padding: 5px 20px">
              <span style="color: #999">
                {{ product.description }}
              </span>
            </div>
            <div style="padding: 10px 20px">
              作者：
              <a-avatar :src="product.userVO?.avatar" />
              <span ml2 style="font-weight: 550">{{
                product.userVO?.name
              }}</span>
            </div>
            <div style="padding: 5px 20px" v-if="product.type != '免费'">
              <a-button
                type="primary"
                font-550
                @click="handleMembershipPurchase(product.id)"
                >￥{{ product.price }} 立即购买
              </a-button>
              <a-button
                font-550
                type="primary"
                v-if="product.type == '会员免费'"
                ml4
                @click=""
                style="background-color: rgba(255, 165, 0, 0.3); color: #ff6600"
              >
                开通会员免费看
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-card :bordered="false" mt5>
        <a-tabs defaultActiveKey="介绍">
          <a-tab-pane key="介绍" tab="介绍">
            <div
              style="padding: 0 30px"
              v-html="sanitizeMarkdown(product?.description || '')"
            ></div>
          </a-tab-pane>
          <a-tab-pane key="内容" tab="内容">
            <div
              style="padding: 0 30px"
              v-html="sanitizeMarkdown(product?.content || '')"
              v-if="
                (product.isBuy == 1 && product.type == '付费') ||
                product.type == '免费' ||
                (product.type == '会员免费' && User.role == 'vip')
              "
            ></div>
            <div v-else>
              <a-result title="抱歉，您没有权限访问该资源。请先购买或成为会员">
                <template #extra>
                  <div style="padding: 5px 20px" v-if="product.type != '免费'">
                    <a-button
                      type="primary"
                      font-550
                      @click="handleMembershipPurchase(product.id)"
                      >￥{{ product.price }} 立即购买
                    </a-button>
                    <a-button
                      font-550
                      type="primary"
                      v-if="product.type == '会员免费'"
                      ml4
                      @click=""
                      style="
                        background-color: rgba(255, 165, 0, 0.3);
                        color: #ff6600;
                      "
                    >
                      开通会员
                    </a-button>
                  </div>
                </template>
              </a-result>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <div v-else>
      <p style="text-align: center; color: #999">加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

import DOMPurify from "dompurify"; // 用于清理 HTML 防止 XSS

const route = useRoute();
const router = useRouter();
const productId = computed(() => route.params.id);
const product = ref(<ProductVO>{}); // 初始化为 null，避免 undefined 错误
import { useUserStore } from "@/stores/user";
import { getProductByIdUsingGet } from "@/servers/api/productController.ts";
import ProductVO = API.ProductVO;
import { createOrderUsingPost } from "@/servers/api/orderController.ts";
import { payUsingGet } from "@/servers/api/alipayController.ts";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
});

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

// 获取角色颜色
const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "user":
      return "blue";
    case "vip":
      return "orange";
    default:
      return "default";
  }
};

const createOrderRequest = ref<API.OrderCreateRequest>({
  payMethod: "支付宝",
});

async function handleMembershipPurchase(productId) {
  try {
    createOrderRequest.value.productId = productId;
    console.log(productId);
    // Step 1: 创建订单
    const orderResponse = await createOrderUsingPost(createOrderRequest.value);
    if (orderResponse.code != 200) {
      throw new Error("订单创建失败: " + orderResponse.message);
    }
    // Step 2: 调用支付接口
    window.location.href = `http://localhost:9666/api/alipay/pay/${orderResponse.data}`;
  } catch (error) {
    console.error(error);
    message.error(error.message || "操作失败");
  }
}

// 获取文章详情
const fetchProduct = async () => {
  if (!productId.value) {
    message.error("无效的文章ID！");
    router.go(-1); // 返回
    return;
  }

  try {
    const response = await getProductByIdUsingGet({ id: productId.value });
    if (response.code == 200) {
      product.value = response.data;
    } else {
      message.error("加载文章失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 滚动到底部
const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

// Markdown 转换并清理 HTML
const sanitizeMarkdown = (content: string) => {
  const markedContent = marked(content || "");
  return DOMPurify.sanitize(markedContent); // 确保内容安全
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchProduct();
    } else {
      message.error("无效的ID！");
    }
  },
  { immediate: true }
);

// 随机颜色数组
const colors = [
  "blue",
  "green",
  "red",
  "orange",
  "purple",
  "cyan",
  "geekblue",
  "lime",
  "gold",
  "magenta",
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

onMounted(async () => {
  await getProductByIdUsingGet({ id: productId.value });
});
</script>

<style scoped>
.post-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.content-markdown {
  line-height: 1.8;
  font-size: 16px;
}

.float-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-markdown h1 {
  font-size: 24px;
  font-weight: bold;
}

.content-markdown p {
  margin: 10px 0;
}

.content-markdown code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.post-tags {
  margin-top: 20px;
  margin-bottom: 20px;
}

.post-actions {
  margin-top: 20px;
}

/* AI总结卡片悬浮样式 */
.ai-summary-card {
  position: fixed;
  top: 40%;
  right: 100px;
  width: 350px;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background-color: #fff;
}

.summary-placeholder {
  color: #909090;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
}

.ai-summary-result {
  color: #333;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
