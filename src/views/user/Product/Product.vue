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
} from "@ant-design/icons-vue";
import { onMounted, ref, reactive, computed } from "vue";
import { message } from "ant-design-vue";

import { useRouter } from "vue-router";
import CrudTableModal from "@/views/admin/post/components/post-crud-table-modal.vue";
import PostVO = API.PostVO;
import { useUserStore } from "@/stores/user";
import {
  getAllProductVoUsingPost,
  getAllTagsUsingGet1,
  getProductsByTagsUsingGet,
  searchProductBySearchTextUsingGet,
} from "@/servers/api/productController.ts";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});
const router = useRouter();

const tagsData = ref(); // 标签数据
const selectTags = reactive([]); // 标签选中状态
const searchText = ref(""); // 搜索输入框内容
const current = ref(1); // 当前页
const pageSize = ref(10); // 每页教程数量
const activeSort = ref("createTime"); // 默认排序字段为创建时间
const sortOrder = ref("desc"); // 默认降序
const product = ref([]);

// 加载帖子数据
const loadProduct = async () => {
  try {
    const response = await getAllProductVoUsingPost();
    if (response.code === 200) {
      product.value = response.data?.filter((item) => item.isShelves === 1);
      console.log(response.data);
    } else {
      message.error("加载教程失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 排序改变时触发
const handleSortChange = async (key) => {
  activeSort.value = key;
  await loadProduct();
};

const goToProductDetail = (id: number) => {
  router.push({ name: "ProductDetail", params: { id } });
};

// 分页教程
const paginatedArticles = computed(() => {
  const start = (current.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return product.value ? product.value.slice(start, end) : [];
});

// 搜索教程方法
const searchArticles = async () => {
  try {
    const response = await searchProductBySearchTextUsingGet({
      searchText: searchText.value,
    });
    product.value = response.data?.filter((item) => item.isShelves === 1);
    searchText.value = "";
    if (product.value.length <= 0) {
      message.warn("未找到相关结果");
    } else {
      message.success("搜索成功");
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 获取所有标签
const getTags = async () => {
  try {
    const response = await getAllTagsUsingGet1();
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

// 根据标签获取教程
const fetchArticlesByTag = async (tag: string) => {
  try {
    const response = await getProductsByTagsUsingGet({ tags: tag });
    if (response.code === 200) {
      product.value = response.data?.filter((item) => item.isShelves === 1);
    } else {
      message.error("获取教程失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

//获取所有教程
const fetchAllProduct = async () => {
  try {
    const response = await getAllProductVoUsingPost();
    if (response.code === 200) {
      product.value = response.data?.filter((item) => item.isShelves === 1);
    } else {
      message.error("获取教程失败：" + response.message);
    }
  } catch (error) {
    message.error("网络请求失败，请稍后重试！");
  }
};

// 标签切换事件
const handleChange = (tag: string, checked: boolean, index: number) => {
  selectTags.forEach((_, idx) => (selectTags[idx] = false)); // 重置所有标签状态
  if (checked) {
    selectTags[index] = true;
    fetchArticlesByTag(tag); // 根据选中标签加载教程
  } else {
    // 检查是否所有标签都取消选中
    const hasSelectedTags = selectTags.some((selected) => selected);
    if (!hasSelectedTags) {
      fetchAllProduct(); // 如果没有选中的标签，则加载所有教程
    }
  }
};

// 分页事件
const handlePaginationChange = (page: number, size: number) => {
  current.value = page;
  pageSize.value = size;
};

// 页面加载时，获取标签并加载所有教程
onMounted(() => {
  loadProduct();
  getTags();
  fetchAllProduct(""); // 初始加载所有教程
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

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
            placeholder="搜索教程"
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
      </div>
      <!--      <a-divider />-->
      <div style="padding: 0px 20px">
        <a-tabs v-model:activeKey="activeSort" @change="handleSortChange">
          <a-tab-pane key="createTime" tab="最新"></a-tab-pane>
          <a-tab-pane key="viewsNum" tab="最热"></a-tab-pane>
          <a-tab-pane key="thumbNum" tab="最多购买"></a-tab-pane>
        </a-tabs>
      </div>
      <!-- 教程列表 -->
      <div class="product-list">
        <a-card
          v-for="item in product"
          :key="item.id"
          mt5
          hoverable
          @click="goToProductDetail(item.id)"
        >
          <template #cover>
            <img :src="item.images" width="100%" height="230px" />
          </template>
          <div style="font-size: 22px; font-weight: 550">{{ item.title }}</div>

          <div style="margin: 10px 0px">
            <span style="color: #585858">{{ item.description }}</span>
          </div>
          <div style="margin: 10px 0px">
            <a-tag
              color="blue"
              style="border-radius: 0"
              v-for="tag in item.tags"
              :key="tag"
              >{{ tag }}
            </a-tag>
          </div>
          <div style="margin: 10px 0px">
            <span style="color: #ff6700; font-weight: 550; font-size: 18px"
              >￥{{ item.price }}</span
            ><span style="margin-left: 10px; color: #8e8e8e"
              >已售 {{ item.buyNum }}</span
            >
            <a-tag
              color="orange"
              style="float: right"
              v-if="item.type == '会员免费'"
              >{{ item.type }}
            </a-tag>
            <a-tag color="blue" style="float: right" v-if="item.type == '免费'"
              >{{ item.type }}
            </a-tag>
            <a-tag color="red" style="float: right" v-if="item.type == '付费'"
              >{{ item.type }}
            </a-tag>
          </div>
          <div>
            <a-avatar
              :src="item.userVO.avatar"
              size="large"
              style="
                position: absolute;
                top: 205px;
                right: 30px;
                width: 50px;
                height: 50px;
              "
            />
          </div>
        </a-card>
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

.product-list {
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px; /* Adjust the gap between cards as needed */
}

@media screen {
  .post-content {
    min-width: 70vh;
  }
}
</style>
