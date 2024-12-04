<script setup lang="ts">
import {
  SearchOutlined,
  LikeOutlined,
  CommentOutlined,
  HeartOutlined,
  ShareAltOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { onMounted, ref, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

import {
  deletePostUsingPost,
  favourPostUsingPost,
  getAllPostsUsingPost,
  getAllTagsUsingGet,
  getTotalUsingGet,
  listPagedPostsUsingGet,
  listPostsByTagUsingGet,
  listSortedPostsUsingPost,
  searchPostBySearchTextUsingGet,
  searchPostFromEsUsingPost,
  thumbPostUsingPost,
} from "@/servers/api/postController.ts";

import { useRouter } from "vue-router";
import CrudTableModal from "@/views/admin/post/components/post-crud-table-modal.vue";
import PostVO = API.PostVO;
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});
const router = useRouter();

const tagsData = ref(); // 标签数据
const selectTags = reactive([]); // 标签选中状态
const searchText = ref(""); // 搜索输入框内容
const current = ref(1); // 当前页
const pageSize = ref(10); // 每页文章数量
const total = ref(0);
const activeSort = ref(""); // 默认排序字段为创建时间
const sortOrder = ref("desc"); // 默认降序
const posts = ref([]);

// 加载帖子数据
const loadPosts = async () => {
  try {
    if (activeSort.value == "") {
      const res = await listPagedPostsUsingGet({
        page: current.value,
        size: pageSize.value,
      });
      // const res = await getAllPostsUsingPost();
      if (res.code == 200) {
        posts.value = res.data || [];
      } else {
        message.error(res.message);
      }
    } else {
      current.value = 1; // 重置为第一页
      const res = await listSortedPostsUsingPost({
        sortField: activeSort.value,
        sortOrder: sortOrder.value,
        current: current.value,
        pageSize: pageSize.value,
      });
      if (res.code == 200) {
        posts.value = res.data || [];
      } else {
        message.error(res.message);
      }
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 排序改变时触发
const handlePageChange = (page, size) => {
  current.value = page;
  pageSize.value = size;
  loadPosts();
};

const goToPostDetail = (id: number) => {
  router.push({ name: "PostDetail", params: { id } });
};

// 分页文章
const paginatedArticles = computed(() => {
  const start = (current.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return posts.value ? posts.value.slice(start, end) : [];
});

// 搜索文章方法
const searchArticles = async () => {
  try {
    const response = await searchPostFromEsUsingPost({
      searchText: searchText.value,
    });
    posts.value = response.data; // 更新文章列表

    searchText.value = "";
    if (posts.value.length <= 0) {
      message.warn("未找到相关结果");
    } else {
      message.success("搜索成功");
      total.value = response.data?.length;
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 获取所有标签
const getTags = async () => {
  try {
    const response = await getAllTagsUsingGet();
    if (response.code === 200) {
      tagsData.value = response.data;
      tagsData.value.forEach(() => selectTags.push(false));
    } else {
      message.error("获取标签失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 根据标签获取文章
const fetchArticlesByTag = async (tag: string) => {
  try {
    const response = await listPostsByTagUsingGet({ tag });
    if (response.code === 200) {
      posts.value = response.data;
      total.value = response.data?.length;
    } else {
      message.error("获取文章失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
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

// 标签切换事件
const handleChange = (tag: string, checked: boolean, index: number) => {
  selectTags.forEach((_, idx) => (selectTags[idx] = false)); // 重置所有标签状态
  if (checked) {
    selectTags[index] = true;
    fetchArticlesByTag(tag); // 根据选中标签加载文章
  } else {
    // 检查是否所有标签都取消选中
    const hasSelectedTags = selectTags.some((selected) => selected);
    if (!hasSelectedTags) {
      loadPosts();
    }
  }
};

// 分页事件
const handlePaginationChange = (page: number, size: number) => {
  current.value = page;
  pageSize.value = size;
  posts.value = [];
  loadPosts();
};

const getTotal = async () => {
  try {
    const res = await getTotalUsingGet();
    total.value = res.data;
    return res.data;
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 页面加载时，获取标签并加载所有文章
onMounted(() => {
  getTags();
  loadPosts();
  getTotal();
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
};
const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

// 排序改变时触发，同时支持升序降序切换
const handleSortChange = async (key: string) => {
  if (activeSort.value === key) {
    // 切换排序顺序
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    // 修改排序字段，并重置排序顺序为降序
    activeSort.value = key;
    sortOrder.value = "desc";
  }
  current.value = 1; // 重置为第一页
  await loadPosts(); // 重新加载数据
};

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
    await loadPosts();
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

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
</script>

<template>
  <div class="page-container">
    <div class="content">
      <!-- 标签搜索 -->
      <div class="tag" style="padding: 7px 20px">
        <div style="padding: 20px 0px">
          <span style="margin-right: 10px; font-weight: 550; color: #585858"
            >关键词搜索:</span
          >
          <a-input
            v-model:value="searchText"
            placeholder="搜索文章"
            style="width: 250px; border-radius: 50px"
            @pressEnter="searchArticles"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-button
            type="primary"
            style="margin-left: 10px"
            @click="searchArticles"
          >
            搜索
          </a-button>
        </div>
        <div>
          <span style="margin-right: 10px; font-weight: 550; color: #585858"
            >标签搜索:</span
          >
          <a-space :size="[5, 20]" wrap>
            <a-checkable-tag
              v-for="(tag, index) in tagsData"
              :key="tag"
              v-model:checked="selectTags[index]"
              @change="(checked) => handleChange(tag, checked, index)"
              style="
                border: 1px solid #e9e9e9;
                padding: 5px 15px;
                font-size: 16px;
                font-weight: 550;
              "
            >
              {{ tag }}
            </a-checkable-tag>
          </a-space>
        </div>
        <div mt-5>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            发表文章
          </a-button>
          <a-button @click="router.go(0)" ml4>
            <template #icon>
              <RedoOutlined />
            </template>
            刷新
          </a-button>
        </div>
      </div>
      <!--      <a-divider />-->
      <div style="padding: 0px 20px">
        <a-tabs v-model:activeKey="activeSort" @change="handleSortChange">
          <a-tab-pane key="createTime" tab="最新"></a-tab-pane>
          <a-tab-pane key="viewsNum" tab="最热"></a-tab-pane>
          <a-tab-pane key="thumbNum" tab="最多点赞"></a-tab-pane>
          <a-tab-pane key="favourNum" tab="最多收藏"></a-tab-pane>
        </a-tabs>
      </div>
      <!-- 文章列表 -->
      <div class="article-list">
        <div v-if="posts.length > 0" class="card-container">
          <a-card
            hoverable
            v-for="(article, index) in posts"
            :key="index"
            class="article-card-horizontal"
          >
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
                          <span
                            v-html="article.content.substring(0, 200)"
                          ></span
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
                          <a-button
                            type="text"
                            @click="toggleThumb(article.id)"
                          >
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
                          <a-button
                            type="text"
                            @click="toggleFavour(article.id)"
                          >
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
          <a-skeleton active />
        </div>
        <!-- 分页 -->
        <a-pagination
          style="padding: 0px 20px"
          mt-5
          v-model:current="current"
          :page-size="pageSize"
          :total="total"
          show-size-changer
          @change="handlePaginationChange"
          @showSizeChange="handlePaginationChange"
        />
      </div>
    </div>
  </div>
  <CrudTableModal ref="crudTableModal" @ok="fetchArticlesByTag()" />
</template>

<style scoped>
.page-container {
  min-height: 85vh;
}

.content {
  background: #ffffff;
  flex-grow: 1;
  padding: 10px;
  border-radius: 20px;
  max-width: 100vh;
  margin: 15px auto;
  border: 1px solid honeydew;
}

/* 横向卡片容器 */
.card-container {
  display: flex;
  flex-direction: column; /* 卡片纵向排列 */
  gap: 20px; /* 卡片间距 */
}

a-tabs .ant-tabs-tab {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 横向卡片样式 */
.article-card-horizontal {
  display: flex;
  width: 100%; /* 占据容器宽度 */
  padding: 10px;
}

/* 卡片图片 */
.horizontal-image {
  max-width: 300px; /* 图片宽度 */
  max-height: 210px;
  border-radius: 6px;
  position: relative;
  top: 10%;
}

/* 横向卡片内容 */
.horizontal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 横向卡片底部 */
.horizontal-footer {
  margin-top: 10px;
}

.tags {
  margin-bottom: 5px;
}

@media screen {
  .post-content {
    min-width: 70vh;
  }
}
</style>
