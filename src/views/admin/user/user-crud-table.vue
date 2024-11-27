<script setup lang="ts">
import {
  PlusOutlined,
  ManOutlined,
  WomanOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import CrudTableModal from "./components/user-crud-table-modal.vue";
import {
  deleteUserUsingDelete,
  getUsersByCategoryUsingGet,
  getUsersBySearchTextUsingGet,
} from "@/servers/api/userController.ts";
import User = API.User;
import { message } from "ant-design-vue";
import { onMounted, reactive, ref, shallowRef } from "vue";

const columns = shallowRef([
  {
    title: "头像",
    dataIndex: "avatar",
  },
  {
    title: "用户昵称",
    dataIndex: "name",
  },
  {
    title: "账号名",
    dataIndex: "username",
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "角色",
    dataIndex: "role",
  },
  {
    title: "账号状态",
    dataIndex: "status",
  },
  {
    title: "手机号码",
    dataIndex: "mobile",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "地址",
    dataIndex: "address",
  },
  {
    title: "其他信息",
    dataIndex: "otherInfo",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

onMounted(async () => {
  await getUserData();
});

async function getUserData() {
  try {
    const response = await getUsersByCategoryUsingGet({});
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
  } catch (error) {
    message.error("获取用户数据失败:" + error);
  }
}

async function reload() {
  await getUserData();
  message.success("刷新成功");
}

const state = reactive({
  loading: false,
  queryParams: {
    name: "",
    value: "",
    remark: "",
  },
  dataSource: [] as User[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: User) {
  try {
    console.log(record.user_id);
    const res = await deleteUserUsingDelete(<API.deleteUserUsingDELETEParams>{
      user_id: record.user_id,
    });
    if (res.code === 200) {
      message.success("删除成功");
    } else {
      message.error(res.data);
    }
  } catch (e) {
    message.error("删除失败:" + e);
  } finally {
    await getUserData();
    close();
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: User) {
  crudTableModal.value?.open(record);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await getUsersBySearchTextUsingGet({ searchText: searchText });
  if (res.code === 200) {
    state.dataSource = res.data || [];
  }
  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getUserData();
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
              <a-button type="primary" @click="reload" ghost>
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
          <template v-if="scope?.column?.dataIndex === 'avatar'">
            <a-avatar
              v-if="scope?.record?.avatar"
              :src="scope?.record?.avatar"
              style="width: 50px; height: 50px; border-radius: 50%"
            />
            <a-avatar
              v-else
              :size="50"
              style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #a6dbff;
              "
              >{{ scope?.record?.name }}
            </a-avatar>
          </template>
          <template v-if="scope?.column?.dataIndex === 'sex'">
            <ManOutlined
              v-if="scope?.record?.sex == '男'"
              style="color: #2eabff"
            />
            <WomanOutlined
              v-if="scope?.record?.sex == '女'"
              style="color: #ff2ef8"
            />
            <EyeInvisibleOutlined
              v-if="scope?.record?.sex == '保密'"
              style="color: #343434"
            />
          </template>
          <template v-if="scope?.column?.dataIndex === 'status'">
            <span
              v-if="scope?.record?.status == 1"
              style="color: #01c855; font-weight: 600"
              >正常</span
            >
            <span
              v-if="scope?.record?.status == 0"
              style="color: #d2004d; font-weight: 600"
              >禁用</span
            >
          </template>
          <template v-if="scope?.column?.dataIndex === 'role'">
            <a-tag color="blue" v-if="scope?.record?.role == 'user'">
              普通用户
            </a-tag>
            <a-tag color="red" v-if="scope?.record?.role == 'admin'">
              管理员
            </a-tag>
          </template>
          <template v-if="scope?.column?.dataIndex === 'otherInfo'">
            <a-row
              ><span c-gray-4>创建时间：</span>{{ scope?.record?.createTime }}
            </a-row>
            <a-row v-if="scope?.record?.updateTime"
              ><span c-gray-4>更新时间：</span>{{ scope?.record?.updateTime }}
            </a-row>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button type="link" @click="handleEdit(scope?.record as User)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(scope?.record as User)"
              >
                <a-button type="link" style="color: red"> 删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <CrudTableModal ref="crudTableModal" @ok="getUserData" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
