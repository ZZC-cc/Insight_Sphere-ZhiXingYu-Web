<script setup lang="ts">
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import CrudTableModal from "./components/product-crud-table-modal.vue";
import {
  changeShelvesUsingGet,
  deleteProductUsingPost,
  getAllProductVoUsingPost,
  searchProductBySearchTextUsingGet,
} from "@/servers/api/productController.ts";
import ProductVO = API.ProductVO;
import PostVO = API.PostVO;
import { onMounted, reactive, ref, shallowRef } from "vue";

const columns = shallowRef([
  {
    title: "教程封面",
    dataIndex: "images",
  },
  {
    title: "教程名称",
    dataIndex: "title",
  },
  {
    title: "作者",
    dataIndex: "user",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "类别",
    dataIndex: "type",
  },
  {
    title: "教程价格",
    dataIndex: "price",
  },
  {
    title: "购买量",
    dataIndex: "buyNum",
  },
  {
    title: "浏览量",
    dataIndex: "viewsNum",
  },
  {
    title: "教程库存",
    dataIndex: "stock",
  },
  {
    title: "教程描述",
    dataIndex: "description",
  },
  {
    title: "教程状态",
    dataIndex: "isShelves",
  },
  {
    title: "创建&更新时间",
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
    const response = await getAllProductVoUsingPost();
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
    console.log(response.data);
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
  dataSource: [] as ProductVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: ProductVO) {
  try {
    const res = await deleteProductUsingPost({
      id: record.id,
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

async function handleEdit(record: ProductVO) {
  crudTableModal.value?.open(record);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchProductBySearchTextUsingGet({ searchText });
  if (res.code === 200) state.dataSource = res.data || [];

  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}

async function changeShelvesStatus(id: any) {
  console.log(id);
  const res = await changeShelvesUsingGet({ id });
  if (res.code === 200) {
    message.success(res.data);
    await getData();
  } else {
    message.error(res.data);
  }
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
          <template v-if="scope?.column?.dataIndex === 'images'">
            <div flex gap-2>
              <a-image :src="scope?.record.images" height="100px" />
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'title'">
            <b>
              {{ scope?.record?.title }}
            </b>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <a-avatar :src="scope?.record?.userVO?.avatar" />
            <span style="margin-left: 10px; font-weight: 550">
              {{ scope?.record?.userVO?.name }}</span
            >
          </template>
          <template v-if="scope?.column?.dataIndex === 'type'">
            <div flex gap-2>
              <a-tag
                color="blue"
                style="border-radius: 0"
                v-if="scope?.record?.type == '免费'"
              >
                {{ scope?.record?.type }}
              </a-tag>
              <a-tag
                color="orange"
                style="border-radius: 0"
                v-if="scope?.record?.type == '会员免费'"
              >
                {{ scope?.record?.type }}
              </a-tag>
              <a-tag
                color="red"
                style="border-radius: 0"
                v-if="scope?.record?.type == '付费'"
              >
                {{ scope?.record?.type }}
              </a-tag>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'tags'">
            <div flex gap-2>
              <a-tag
                v-for="tag in scope?.record?.tags"
                :key="tag.id"
                color="blue"
                style="border-radius: 0"
              >
                {{ tag }}
              </a-tag>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'price'">
            <span style="color: #ff4000"
              ><b>￥{{ scope?.record?.price }}</b></span
            >
          </template>
          <template v-if="scope?.column?.dataIndex === 'stock'">
            <span v-if="scope?.record?.stock > 20" style="color: #2ecc71"
              ><b>{{ scope?.record?.stock }}</b></span
            >
            <span v-else style="color: red"
              ><b>{{ scope?.record?.stock }}</b></span
            >
          </template>
          <template v-if="scope?.column?.dataIndex === 'description'">
            <div style="width: 300px">
              <span style="color: #a3a3a3">{{
                scope?.record?.description.slice(0, 100)
              }}</span>
              <span
                v-if="scope?.record?.description.length > 100"
                style="color: #a3a3a3"
                >...</span
              >
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'viewsNum'"
            >{{ scope?.record?.viewsNum }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'buyNum'"
            >{{ scope?.record?.buyNum }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'isShelves'">
            <span v-if="scope?.record?.isShelves === 1" style="color: #2ecc71"
              ><b>上架</b></span
            >
            <span v-else style="color: red"><b>下架</b></span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'createTime'">
            <p>
              <span style="color: #a3a3a3">创建时间：</span
              >{{ scope?.record?.createTime }}
            </p>
            <p>
              <span style="color: #a3a3a3">更新时间：</span
              >{{ scope?.record?.updateTime }}
            </p>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button
                type="link"
                @click="changeShelvesStatus(scope?.record.id)"
              >
                <span
                  v-if="scope?.record?.isShelves === 0"
                  style="color: #2ecc71"
                  >上架</span
                >
                <span v-else style="color: red">下架</span>
              </a-button>
              <a-button
                type="link"
                @click="handleEdit(scope?.record as ProductVO)"
              >
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(scope?.record as ProductVO)"
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
