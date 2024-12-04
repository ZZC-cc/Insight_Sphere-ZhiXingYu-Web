<script setup lang="ts">
import { listPlatformsUsingGet } from "@/servers/api/aiPlatformController.ts";
import { onMounted, ref, computed } from "vue";
import AIPlatform = API.AIPlatform;
import {
  deleteModelUsingDelete,
  listModelsByPlatformIdUsingGet,
  listModelsUsingGet,
} from "@/servers/api/aiModelController.ts";
import PlatformModal from "@/views/admin/ai/components/ai-platform-table-modal.vue";
import router from "@/router";
import { PlusOutlined } from "@ant-design/icons-vue";
import AiModelCrudTableModal from "@/views/admin/ai/components/ai-model-crud-table-modal.vue";
import AIModel = API.AIModel;
import { message } from "ant-design-vue";

const platformList = ref<AIPlatform[]>([]);
const modelList = ref<AIPlatform[]>([]);
const selectedPlatformId = ref<string | null>(null);

// 分页状态
const currentPage = ref(1);
const pageSize = ref(4); // 每页显示的条目数

const platformModal = ref<InstanceType<typeof PlatformModal>>();
const modelModal = ref<InstanceType<typeof AiModelCrudTableModal>>();

const getPlatformList = async () => {
  const res = await listPlatformsUsingGet();
  if (res.code === 200) {
    platformList.value = res.data;
  }
};

const selectPlatform = async (id: string) => {
  selectedPlatformId.value = id;
  await getModelList(id);
};

const getModelList = async (id: string) => {
  const res = await listModelsByPlatformIdUsingGet({ platformId: id });
  if (res.code === 200) {
    modelList.value = res.data;
  }
};

function handleAddPlatform() {
  platformModal.value?.open();
}

async function handleEditPlatform(record: AIPlatform) {
  platformModal.value?.open(record);
}

function handleAddModel() {
  modelModal.value?.open();
}

async function handleEditModel(record: AIModel) {
  modelModal.value?.open(record);
}

const handleDeleteModel = async (id: any, platformId: any) => {
  const red = await deleteModelUsingDelete({ id: id });
  if (red.code === 200) {
    await selectPlatform(platformId);
    message.success("删除成功");
  }
};

onMounted(() => {
  getPlatformList();
});
const openWebsite = (url: string) => {
  if (url) {
    window.open(url, "_blank");
  } else {
    console.warn("Platform URL is not available");
  }
};

const columns = [
  { title: "模型名称", dataIndex: "model_name", key: "model_name", width: 150 },
  { title: "模型类型", dataIndex: "model_type", key: "model_type", width: 120 },

  { title: "上下文数量", dataIndex: "context_window", key: "context_window" },
  {
    title: "最大输出",
    dataIndex: "max_output_tokens",
    key: "max_output_tokens",
  },
  { title: "费用", dataIndex: "rate", key: "rate", width: 200 },
  { title: "模型描述", dataIndex: "model_desc", key: "model_desc" },
  { title: "操作", dataIndex: "action", width: 150 },
];
const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 5,
};
</script>

<template>
  <a-card class="main">
    <a-row :span="24">
      <a-col :span="9">
        <a-card style="height: 100%" bordered>
          <template #title>已对接</template>
          <template #extra>
            <a-button type="primary" @click="handleAddPlatform">
              <PlusOutlined />
              添加平台
            </a-button>
          </template>
          <a-list :pagination="pagination" :data-source="platformList">
            <template #renderItem="{ item }">
              <a-row
                :span="24"
                class="platform-card"
                :class="{ 'platform-selected': selectedPlatformId === item.id }"
                @click="selectPlatform(item.id)"
              >
                <a-col :span="2">
                  <img :src="item.platform_image_url" width="100%" mt6 ml2 />
                </a-col>
                <a-col :span="17" ml8>
                  <p
                    text-23px
                    style="
                      line-height: 20px;
                      margin-bottom: 0px;
                      font-weight: 550;
                    "
                  >
                    {{ item.platform_name }}
                  </p>
                  <p style="color: #7d7d7d">{{ item.platform_description }}</p>
                </a-col>
                <a-col :span="2" ml5>
                  <a-button
                    type="default"
                    mt3
                    @click="openWebsite(item.platform_url)"
                  >
                    访问官网
                  </a-button>
                  <a-button
                    type="primary"
                    mt3
                    @click="handleEditPlatform(item as AIPlatform)"
                  >
                    编辑信息
                  </a-button>

                  <a-button type="default" mt3 @click="selectPlatform(item.id)">
                    查看模型
                  </a-button>
                </a-col>
              </a-row>
              <a-divider />
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="14" ml10 mt v-if="selectedPlatformId">
        <a-button type="primary" @click="handleAddModel" mb-3>
          <PlusOutlined />
          添加模型
        </a-button>
        <a-table
          :columns="columns"
          :data-source="modelList"
          :pagination="false"
        >
          <template #bodyCell="scope">
            <template v-if="scope?.column?.dataIndex === 'model_name'">
              <b>{{ scope.record.model_name }}</b>
            </template>
            <template v-if="scope?.column?.dataIndex === 'model_type'">
              <a-tag color="blue">{{ scope.record.model_type }}</a-tag>
            </template>
            <template v-if="scope?.column?.dataIndex === 'rate'">
              <b>$ {{ scope.record.rate }} / 1M tokens</b>
            </template>
            <template v-if="scope?.column?.dataIndex === 'action'">
              <a-button
                type="link"
                @click="handleEditModel(scope.record as AIModel)"
              >
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除吗？"
                @confirm="
                  handleDeleteModel(scope.record.id, scope.record.platform_id)
                "
                ok-text="确定"
                cancel-text="取消"
              >
                <span text-red500>删除</span>
              </a-popconfirm>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </a-card>
  <platformModal ref="platformModal" @ok="getPlatformList" />
  <AiModelCrudTableModal
    ref="modelModal"
    @ok="getModelList(selectedPlatformId)"
  />
</template>

<style scoped>
.main {
  min-height: 80vh;
  padding-left: 50px;
}

a-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.platform-card {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.platform-selected {
  background-color: #f0f8ff;
  border-left: 5px solid #1890ff;
}
</style>
