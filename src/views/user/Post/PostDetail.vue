<template>
  <div class="post-detail">
    <a-page-header
      title="文章详情"
      @back="() => $router.go(-1)"
      :sub-title="post?.title || '加载中...'"
    >
    </a-page-header>
    <div v-if="post">
      <a-card :bordered="false">
        <template #cover>
          <img
            :src="post.cover"
            alt="文章封面"
            v-if="post.cover"
            style="max-height: 700px"
          />
        </template>

        <div text-32px mt-3 fw-bold style="padding: 0px 20px">
          {{ post.title }}
        </div>
        <div class="post-tags" style="padding: 0px 20px">
          <span style="color: #888888">分类：</span>
          <a-tag
            v-for="tag in post.tagList"
            :key="tag"
            :color="getRandomColor()"
          >
            {{ tag }}
          </a-tag>
        </div>
        <div class="post-author" mt-5 style="padding: 0px 20px">
          <a-avatar :src="post.user.avatar" />
          <span>{{ post.user.username }}</span>
          <a-tag :color="getRoleColor(post.user.role)" style="font-weight: 550">
            <span v-if="post.user.role == 'admin'">管理员</span>
            <span v-if="post.user.role == 'user'">普通用户</span>
            <span v-if="post.user.role == 'vip'">vip会员</span>
          </a-tag>
          <span ml-5 style="color: #a5a5a5; font-weight: 400">
            {{ formatDate(post.createTime) }}
          </span>
        </div>
        <a-divider mb-10 mt-5 />
        <div
          style="padding: 0px 20px"
          v-html="sanitizeMarkdown(post.content)"
          mt-5
          class="content-markdown"
        ></div>

        <div class="post-actions" style="padding: 0px 10px">
          <a-button type="text" @click="toggleThumb">
            <template #icon>
              <LikeOutlined
                :style="{ color: post.isThumbed ? 'red' : 'black' }"
              />
            </template>
            <span :style="{ color: post.isThumbed ? 'red' : 'black' }">{{
              post.thumbNum
            }}</span>
          </a-button>
          <a-button type="text" @click="toggleFavour">
            <template #icon>
              <HeartOutlined
                :style="{ color: post.isFavoured ? '#ff6600' : 'black' }"
              />
            </template>
            <span :style="{ color: post.isFavoured ? '#ff6600' : 'black' }">{{
              post.favourNum
            }}</span>
          </a-button>
          <a-button type="text">
            <EyeOutlined />
            {{ post.viewsNum }}
          </a-button>
          <a-button type="text">
            <template #icon>
              <ShareAltOutlined />
            </template>
            分享
          </a-button>
          <a-button
            type="text"
            v-if="post.user.user_id == User.user_id"
            @click="handleEdit(post as PostVO)"
          >
            <EditOutlined />
            编辑
          </a-button>

          <a-popconfirm
            title="确定删除该条数据？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(article.id)"
          >
            <a-button
              type="text"
              style="color: red"
              v-if="post.user.user_id == User.user_id"
            >
              <DeleteOutlined />
              删除
            </a-button>
          </a-popconfirm>
        </div>
      </a-card>
      <!-- AI总结全文悬浮卡片 -->
      <div class="ai-summary-card">
        <a-card title="AI总结全文" bordered>
          <!-- 显示 AI 总结 -->
          <a-alert v-if="summary" type="info" :message="summary" mb-5></a-alert>
          <div>
            <a-button
              type="primary"
              icon="🤖"
              :loading="summarizing"
              @click="handleSummarize"
              block
            >
              {{ summarizing ? "总结中..." : "生成总结" }}
            </a-button>
          </div>
          <div class="summary-placeholder">
            点击按钮让 AI 为您总结这篇文章的精华内容。
          </div>
        </a-card>
      </div>

      <a-card :bordered="false" mt-5>
        <CommentModel :post-id="postId" style="padding: 0 30px" @ok="getData" />
      </a-card>
    </div>
    <div v-else>
      <p style="text-align: center; color: #999">加载中...</p>
    </div>

    <!-- 悬浮按钮 -->
    <a-float-button-group shape="circle" mr-10 mb-20>
      <a-float-button @click="scrollToTop">
        <template #icon>
          <UpOutlined />
        </template>
        <template #tooltip>
          <div>回到顶部</div>
        </template>
      </a-float-button>
      <a-float-button @click="scrollToBottom">
        <template #icon>
          <DownOutlined />
        </template>
        <template #tooltip>
          <div>底部</div>
        </template>
      </a-float-button>
    </a-float-button-group>
  </div>
  <CrudTableModal ref="crudTableModal" @ok="router.go(0)" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

import DOMPurify from "dompurify"; // 用于清理 HTML 防止 XSS
import {
  getPostVoByIdUsingGet,
  thumbPostUsingPost,
  favourPostUsingPost,
  incrementViewUsingPost,
  deletePostUsingPost,
  generateSummaryUsingPost,
} from "@/servers/api/postController.ts";
import {
  LikeOutlined,
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  UpOutlined,
  DownOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import PostVO = API.PostVO;
import CommentModel from "@/views/user/Post/comment-model.vue";
import CrudTableModal from "@/views/admin/post/components/post-crud-table-modal.vue";

const route = useRoute();
const router = useRouter();
const postId = computed(() => route.params.id);
const post = ref<PostVO | null>(null); // 初始化为 null，避免 undefined 错误
import { useUserStore } from "@/stores/user";

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

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(postId) {
  try {
    const res = await deletePostUsingPost({
      post_id: postId,
    });
    if (res.code === 200) message.success("删除成功");
    else message.error(res.data);
  } catch (e) {
    message.error(`删除失败:${e}`);
  } finally {
    route.go(0);
  }
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

// 获取文章详情
const fetchPost = async () => {
  if (!postId.value) {
    message.error("无效的文章ID！");
    router.push("/"); // 返回到主页
    return;
  }

  try {
    const response = await getPostVoByIdUsingGet({ id: postId.value });
    if (response.code == 200) {
      post.value = response.data;
    } else {
      message.error("加载文章失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 点赞功能
const toggleThumb = async () => {
  if (post.value) {
    await thumbPostUsingPost({ postId: post.value.id });
    post.value.thumbNum += post.value.isThumbed ? -1 : 1;
    post.value.isThumbed = !post.value.isThumbed;
  }
};

// 收藏功能
const toggleFavour = async () => {
  if (post.value) {
    await favourPostUsingPost({ postId: post.value.id });
    post.value.favourNum += post.value.isFavoured ? -1 : 1;
    post.value.isFavoured = !post.value.isFavoured;
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
// Markdown 转换并清理 HTML
const sanitizeMarkdown = (content: string) => {
  const markedContent = marked(content || "");
  return DOMPurify.sanitize(markedContent); // 确保内容安全
};

// 路由参数变化时重新加载文章
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await fetchPost();
      if (post.value) {
        // 等待 DOM 更新后执行高亮
        nextTick(() => {
          document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block); // 执行高亮
          });
        });
      }
    } else {
      message.error("无效的文章ID！");
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
  await incrementViewUsingPost({ postId: postId.value });
});

const summarizing = ref(false); // 总结按钮加载状态
const summary = ref(""); // 存储总结结果
// 点击总结按钮的逻辑
const handleSummarize = async () => {
  if (summarizing.value) return; // 防止重复点击
  summarizing.value = true;
  summary.value = ""; // 清空旧数据

  try {
    const response = await generateSummaryUsingPost({ postId: post.value.id });
    if (response.code == 200) {
      summary.value = response.data; // 显示 AI 总结内容
      message.success("AI 总结成功！");
    } else {
      message.error("AI 总结失败：" + response.message);
    }
  } catch (error) {
    message.error("调用 AI 服务失败，请稍后重试！");
  } finally {
    summarizing.value = false;
  }
};
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
