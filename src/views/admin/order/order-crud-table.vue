<script setup lang="ts">
import {
  PlusOutlined,
  ManOutlined,
  WomanOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";

import User = API.User;
import { message } from "ant-design-vue";

import OrderUpdateRequest = API.OrderUpdateRequest;
import { onMounted, reactive, ref, shallowRef } from "vue";
import {
  deleteOrderUsingPost,
  getAllOrderVoUsingPost,
  searchOrderBySearchTextUsingGet,
  updatePayStatusUsingPost,
} from "@/servers/api/orderController.ts";
import Order from "@/views/user/Order/Order.vue";
import OrderVO = API.OrderVO;
import ProductVO = API.ProductVO;
import CrudTableModal from "@/views/admin/product/components/product-crud-table-modal.vue";

const columns = shallowRef([
  {
    title: "订单内容",
    dataIndex: "orderDetail",
    width: 900,
  },
  {
    title: "支付金额",
    dataIndex: "Detail",
  },
  {
    title: "订单状态",
    dataIndex: "status",
  },
  {
    title: "用户信息",
    dataIndex: "user",
  },

  {
    title: "其他信息",
    dataIndex: "order",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

onMounted(async () => {
  await getData();
});

const orderVO = ref<OrderVO[]>([]);

async function getData() {
  try {
    const response = await getAllOrderVoUsingPost();
    console.log(response.data);
    // 处理响应数据，将数据赋值给 state.dataSource
    orderVO.value = response.data || [];
  } catch (error) {
    message.error("获取数据失败:" + error);
  }
}

async function reload() {
  await getData();
  message.success("刷新成功");
}

async function handleDelete(record: Order) {
  try {
    const res = await deleteOrderUsingPost({
      id: record.id,
    });
    if (res.code === 200) {
      message.success("删除成功");
    } else {
      message.error(res.message);
    }
  } catch (e) {
    message.error("删除失败:" + e);
  } finally {
    await getData();
    close();
  }
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchOrderBySearchTextUsingGet({ searchText: searchText });
  if (res.code === 200) {
    state.dataSource = res.data;
    message.success("查询成功");
  }
}

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleEdit(record: ProductVO) {
  crudTableModal.value?.open(record);
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
              <a-button type="primary" @click="reload" ghost>
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
      <a-table row-key="id" :columns="columns" :data-source="orderVO">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'orderDetail'">
            <a-row>
              <a-col span="8">
                <a-image
                  :src="scope?.record?.product?.images"
                  :preview="{ visible: false }"
                  :height="120"
                />
              </a-col>
              <a-col span="16">
                <b>{{ scope?.record?.product?.title }}</b>
                <div mt1 style="color: #878787">
                  {{ scope?.record?.product?.description }}
                  <a-button
                    type="link"
                    @click="handleEdit(scope?.record.product as ProductVO)"
                    >查看详情
                  </a-button>
                </div>
              </a-col>
            </a-row>
          </template>
          <template v-if="scope?.column?.dataIndex === 'Detail'">
            <div>
              <span style="color: #ff4000; font-weight: 550"
                >￥{{ scope?.record?.money }}</span
              >
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'status'">
            <div>
              <b>
                <span v-if="scope?.record?.status === 0" style="color: red"
                  >未支付</span
                >
                <span v-if="scope?.record?.status === 1" style="color: blue"
                  >已支付</span
                >
              </b>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <div flex gap-2>
              <b>购买用户</b>
              <a-avatar :src="scope?.record?.user?.avatar" size="small" />
              <div flex flex-col>
                <div>{{ scope?.record?.user?.name }}</div>
              </div>
            </div>
            <div flex flex-col mt2>
              <div>
                <b>手机号：</b>
                <span>{{ scope?.record?.user?.mobile }}</span>
              </div>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'order'">
            <div><b>订单编号：</b>NO.{{ scope?.record?.id }}</div>
            <div>
              <b>支付方式：</b>{{ scope?.record?.paymentMethod || "-" }}
            </div>
            <div>
              <b>支付时间：</b>{{ scope?.record?.payTime
              }}<span v-if="!scope?.record?.payTime">-</span>
            </div>
            <div><b>更新时间：</b>{{ scope?.record?.updateTime }}</div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-popconfirm
                title="确定删除该条数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(scope?.record as OrderVO)"
              >
                <a-button type="link" style="color: red"> 删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <CrudTableModal ref="crudTableModal" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
