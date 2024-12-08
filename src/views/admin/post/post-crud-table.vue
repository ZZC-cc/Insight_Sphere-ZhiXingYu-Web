<script setup lang="ts">
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import CrudTableModal from "./components/post-crud-table-modal.vue";

import User = API.User;
import { message } from "ant-design-vue";
import PostVO = API.PostVO;
import { onMounted, reactive, ref, shallowRef } from "vue";
import {
  deletePostUsingPost,
  getAllPostsUsingPost,
  searchPostBySearchTextUsingGet,
} from "@/servers/api/postController.ts";
import Post from "@/views/user/Post/Post.vue";

const columns = shallowRef([
  {
    title: "封面",
    dataIndex: "cover",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "创建用户",
    dataIndex: "user",
  },
  {
    title: "文章信息",
    dataIndex: "post",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
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
    const response = await getAllPostsUsingPost({
      searchText: "",
    });
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
  dataSource: [] as PostVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: Post) {
  try {
    const res = await deletePostUsingPost({
      post_id: record.id,
    });
    if (res.code === 200) message.success("删除成功");
    else message.error(res.data);
  } catch (e) {
    message.error(`删除失败:${e}`);
  } finally {
    await getData();
    close();
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchPostBySearchTextUsingGet({ searchText });
  if (res.code === 200) state.dataSource = res.data || [];

  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}
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
              <a-button type="primary" @click="handleAdd">
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
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
          <template v-if="scope?.column?.dataIndex === 'cover'">
            <a-image
              :src="scope?.record?.cover"
              style="max-width: 200px"
              v-if="scope?.record?.cover"
            />
            <div v-else style="text-align: center">暂无封面</div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'title'">
            <div style="width: 250px">
              <b>{{ scope?.record?.title }}</b>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'content'">
            <div style="width: 300px">
              {{ scope?.record?.content.slice(0, 100)
              }}<span v-if="scope?.record?.content.length > 100">...</span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'tags'">
            <a-tag v-for="tag in scope?.record?.tagList" color="blue">
              {{ tag }}
            </a-tag>
          </template>
          <template v-if="scope?.column?.dataIndex === 'post'">
            <p>
              标题字数：<span style="color: #999">{{
                scope?.record?.title.length
              }}</span>
            </p>
            <p>
              内容字数：<span style="color: #999">{{
                scope?.record?.content.length
              }}</span>
            </p>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <a-avatar :src="scope?.record?.user.avatar" />
            &nbsp;{{ scope?.record?.user?.name }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button
                type="link"
                @click="handleEdit(scope?.record as PostVO)"
              >
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(scope?.record as PostVO)"
              >
                <a-button type="link" style="color: red"> 删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <CrudTableModal ref="crudTableModal" @ok="getData" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
