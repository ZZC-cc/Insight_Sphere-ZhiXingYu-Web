<template>
  <div class="post-page">
    <!-- 文章列表 -->
    <div class="article-list">
      <div v-if="posts.length > 0" class="card-container">
        <a-card hoverable v-for="(article, index) in posts" :key="index" mb2>
          <div class="horizontal-layout">
            <a-row :span="24" :wrap="false">
              <a-col :span="19.5">
                <!-- 左侧内容 -->
                <div class="horizontal-content">
                  <div
                    class="horizontal-title"
                    mb-3
                    @click="goToPostDetail(article.id)"
                  >
                    <a-row span="24" style="width: 200px; height: 50px">
                      <a-col span="10.5">
                        <a-avatar size="large" :src="article.user.avatar" />
                      </a-col>
                      <a-col span="13.5" ml-3 mt-0.8>
                        <div
                          style="
                            color: #303030;
                            font-weight: 700;
                            font-size: 16px;
                            line-height: 16px;
                            margin-bottom: 8px;
                          "
                        >
                          {{ article.user.name }}
                          <a-tag
                            :color="getRoleColor(article.user.role)"
                            style="margin-left: 5px; font-size: 10px"
                          >
                            <span v-if="article.user.role == 'admin'"
                              >管理员</span
                            >
                            <span v-if="article.user.role == 'user'"
                              >普通用户</span
                            >
                            <span v-if="article.user.role == 'vip'"
                              >vip会员</span
                            >
                          </a-tag>
                        </div>
                        <div
                          style="
                            font-size: 12px;
                            color: #909090;
                            line-height: 10px;
                          "
                        >
                          {{ article.createTime }}
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                  <a-card-meta @click="goToPostDetail(article.id)">
                    <template #description>
                      <div
                        text-20px
                        mt1
                        style="color: #303030; font-weight: 600"
                        v-html="article.title"
                      ></div>
                      <div
                        :style="{ width: article.cover ? '90%' : '100%' }"
                        class="post-content"
                      >
                        <span v-html="article.content.substring(0, 200)"></span
                        >...
                        <a
                          href=""
                          ml-2
                          style="
                            color: #0080ff;
                            font-family: 'Microsoft YaHei UI';
                          "
                          >查看全文</a
                        >
                      </div>
                    </template>
                  </a-card-meta>
                  <div class="horizontal-footer">
                    <div class="tags" mt-2>
                      <a-tag
                        v-for="tag in article.tagList"
                        :key="tag"
                        :color="getRandomColor()"
                        >{{ tag }}
                      </a-tag>
                    </div>
                    <div class="actions" mt-5 mb--3>
                      <div>
                        <a-button type="text" @click="toggleThumb(article.id)">
                          <span
                            v-if="article.isThumbed"
                            style="color: red; font-weight: 550"
                          >
                            👍<!--                              <LikeOutlined mr1 />-->
                            {{ article.thumbNum }}
                          </span>
                          <span v-else>
                            <LikeOutlined /> {{ article.thumbNum }}
                          </span>
                        </a-button>
                        <a-button type="text" @click="toggleFavour(article.id)">
                          <span
                            v-if="article.isFavoured"
                            style="color: #ff6600; font-weight: 550"
                            >⭐
                            <!--                              <HeartOutlined mr1 />-->
                            {{ article.favourNum }}</span
                          >
                          <span v-else>
                            <HeartOutlined mr1 />
                            {{ article.favourNum }}
                          </span>
                        </a-button>

                        <a-button type="text">
                          <EyeOutlined />
                          {{ article.viewsNum }}
                        </a-button>
                        <a-button
                          type="text"
                          @click="goToPostDetail(article.id)"
                        >
                          <CommentOutlined />
                          评论
                        </a-button>
                        <a-button type="text">
                          <ShareAltOutlined />
                          分享
                        </a-button>
                        <a-button
                          type="text"
                          v-if="article.user.user_id == User.user_id"
                          @click="handleEdit(article as PostVO)"
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
                            v-if="article.user.user_id == User.user_id"
                          >
                            <DeleteOutlined />
                            删除
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="4.5">
                <img
                  v-if="article.cover"
                  @click="goToPostDetail(article.id)"
                  :alt="article.title"
                  :src="article.cover"
                  class="horizontal-image"
                />
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>
      <div v-else>
        <a-empty />
      </div>
    </div>
  </div>
  <CrudTableModal ref="crudTableModal" @ok="getPostList()" />
</template>

<script setup lang="ts">
import {
  deletePostUsingPost,
  favourPostUsingPost,
  getFavouredPostsUsingGet,
  getTotalUsingGet,
  thumbPostUsingPost,
} from "@/servers/api/postController.ts";
import { computed, onMounted, ref } from "vue";
import PostVO = API.PostVO;
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HeartOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons-vue";
import router from "@/router";
import { message } from "ant-design-vue";

const posts = ref(<PostVO>{});

import { useUserStore } from "@/stores/user";
import CrudTableModal from "@/views/admin/post/components/post-crud-table-modal.vue";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});

function getPostList() {
  const res = getFavouredPostsUsingGet();
  res.then((data) => {
    posts.value = data.data;
  });
}

const goToPostDetail = (id: number) => {
  router.push({ name: "PostDetail", params: { id } });
};

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

// 颜色数组
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

const current = ref(1); // 当前页
const pageSize = ref(5); // 每页文章数量

// 页面加载时，获取标签并加载所有文章
onMounted(() => {
  getPostList();
});

const toggleThumb = async (postId) => {
  const res = await thumbPostUsingPost({ postId });
  const index = posts.value.findIndex((item) => item.id === postId);
  if (index !== -1) {
    posts.value[index] = {
      ...posts.value[index],
      thumbNum:
        posts.value[index].thumbNum + (posts.value[index].isThumbed ? -1 : 1),
      isThumbed: !posts.value[index].isThumbed,
    };
    posts.value = [...posts.value];
  }
  getPostList();
};

const toggleFavour = async (postId) => {
  const res = await favourPostUsingPost({ postId });
  const index = posts.value.findIndex((item) => item.id === postId);
  if (index !== -1) {
    posts.value[index] = {
      ...posts.value[index],
      favourNum:
        posts.value[index].favourNum + (posts.value[index].isFavoured ? -1 : 1),
      isFavoured: !posts.value[index].isFavoured,
    };
    posts.value = [...posts.value];
  }
  getPostList();
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
    await getPostList();
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}
</script>

<style scoped>
/* 卡片图片 */
.horizontal-image {
  max-width: 300px; /* 图片宽度 */
  max-height: 210px;
  border-radius: 6px;
  position: relative;
  top: 10%;
}
</style>
