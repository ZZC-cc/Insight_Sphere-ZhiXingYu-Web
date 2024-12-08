<script setup lang="ts">
import { message } from "ant-design-vue";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import VirtualList from "@/components/virtual-list/index.vue";
import TaskVO = API.TaskVO;
import {
  getTaskByStatusUsingPost,
  getTaskByUserUsingPost,
  getTaskDataUsingPost,
  searchTaskUsingPost,
} from "~/servers/api/taskController.ts";
import router from "~/router";

const { userId } = useUserStore();

const dataSource = ref([]);

/*
  获取数据
*/
async function getList() {
  const data = await getTaskByUserUsingPost({ userId: userId });
  const res = await getTaskDataUsingPost({ userId: userId });
  dataSource.value = data.data ?? [];
}

onMounted(async () => {
  await getList();
});

const radioValue = ref("全部");

function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: { id: postId }, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}
</script>

<template>
  <!-- 列表 -->
  <!-- 列表主体 -->
  <a-list :data-source="dataSource" v-if="dataSource.length > 0">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-row>
          <a-list-item-meta>
            <template #title>
              <a href="" font-bold text-16px>{{ item.taskName }}</a>
            </template>
            <template #description>
              关联文章：<a :href="getArticleDetailLink(item.post.id)"
                >《{{ item.post.title }}》</a
              >
            </template>
          </a-list-item-meta>
        </a-row>

        <a-row class="flex text-gray-400" :span="24">
          <a-row class="w-50 flex items-center mr30px">
            进度：
            <a-progress :percent="item.progress" :status="item.status" />
          </a-row>
          <div class="flex flex-col items-center mr30px ml30px">
            <div>优先级</div>
            <div>
              <b v-if="item.priority == '高'" c-red-6>{{ item.priority }}</b>
              <b v-if="item.priority == '中'" c-yellow-4>{{ item.priority }}</b>
              <b v-if="item.priority == '低'" c-green-6>{{ item.priority }}</b>
            </div>
          </div>
          <div class="flex flex-col items-center mr30px ml30px">
            <div>创建用户</div>
            <div>
              <a-avatar size="small" :src="item.user.avatar" />
              <a href="">{{ item.user.username }}</a>
            </div>
          </div>
          <div class="flex flex-col items-center mr30px ml30px">
            <div>负责人</div>
            <div>
              <a-avatar size="small" :src="item.principal.avatar" />
              <a href="">{{ item.principal.username }}</a>
            </div>
          </div>
          <div class="px-5 mr30px ml30px">
            <div>开始时间</div>
            <div>{{ item.startTime }}</div>
          </div>
          <div class="px-5 mr30px ml30px" v-if="item.endTime">
            <div>结束时间</div>
            <div>{{ item.endTime }}</div>
          </div>
        </a-row>
      </a-list-item>
    </template>
  </a-list>
</template>

<style>
.a-extra {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
