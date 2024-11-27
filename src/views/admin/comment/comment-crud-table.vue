<script setup lang="ts">
import { ReloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import CommentVO = API.CommentVO;
import { onMounted, reactive, ref, shallowRef } from "vue";
import {
  deleteCommentUsingPost,
  getAllCommentsListUsingGet,
  getCommentBySearchTextUsingGet,
} from "@/servers/api/commentController.ts";
import CommentModel from "@/views/user/Post/comment-model.vue";

const columns = shallowRef([
  {
    title: "回复人",
    dataIndex: "user",
  },
  {
    title: "回复内容",
    dataIndex: "content",
  },
  {
    title: "回复文章",
    dataIndex: "post_name",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

onMounted(async () => {
  await getData();
});

async function getData() {
  try {
    const response = await getAllCommentsListUsingGet();
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
  } catch (error) {
    message.error(`获取文章数据失败:${error}`);
  }
}

async function reload() {
  await getData();
  message.success("刷新成功");
}

const state = reactive({
  loading: false,
  queryParams: {
    name: "",
    value: "",
    remark: "",
  },
  dataSource: [] as CommentVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

async function deleteComment(id: any) {
  try {
    const response = await deleteCommentUsingPost({
      id,
    });
    if (response.code === 200) {
      message.success("删除成功");
      await getData();
    } else {
      console.error("删除失败:", response.message);
    }
  } catch (error) {
    console.error("删除错误:", error);
  }
}

const selectedPostId = ref();

function handleEdit(postId: any) {
  selectedPostId.value = postId;
  showCommentModel.value = true;
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await getCommentBySearchTextUsingGet({ searchText });
  if (res.code === 200) {
    state.dataSource = res.data || [];
    message.success("查询成功");
  } else {
    message.error(`查询失败:${res.message}`);
  }
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}

const showCommentModel = ref(false);
</script>

<template>
  <page-container>
    <a-card mb-4>
      <a-form class="system-crud-wrapper" :label-col="{ span: 7 }">
        <a-row :span="24">
          <a-col :span="18">
            <a-space size="middle">
              <a-button type="primary" ghost @click="reload">
                <template #icon>
                  <ReloadOutlined />
                </template>
                刷新
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="6">
            <a-space style="float: right">
              <a-input-search
                v-model:value="searchText"
                placeholder="请输入搜索内容"
                enter-button="查询"
                style="width: 250px"
                @search="initQuery(searchText)"
              />
              <a-button @click="cleanQuery"> 重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card>
      <a-table
        row-key="id"
        :loading="state.loading"
        :columns="columns"
        :data-source="state.dataSource"
        :pagination="state.pagination"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'user'">
            <a-avatar :src="scope?.record?.user.avatar" />
            <span>&nbsp;&nbsp;{{ scope?.record?.user.name }}</span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'content'">
            {{ scope?.record?.content }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'post_name'">
            <b>{{ scope?.record?.post_name }}</b>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button type="link" @click="handleEdit(scope?.record.post_id)">
                回复
              </a-button>
              <a-popconfirm
                title="确定删除吗？"
                @confirm="deleteComment(scope?.record.id)"
              >
                <a-button type="link" style="color: red"> 删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="showCommentModel"
      style="width: 800px"
      @ok="
        getData();
        showCommentModel = !showCommentModel;
      "
      @cancel="
        getData();
        showCommentModel = false;
      "
      @close="showCommentModel = false"
    >
      <CommentModel
        :post-id="selectedPostId"
        style="padding: 0 30px"
        @ok="getData"
      />
    </a-modal>
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
