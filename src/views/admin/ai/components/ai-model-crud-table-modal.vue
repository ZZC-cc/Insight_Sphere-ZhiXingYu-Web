<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";

import { computed, ref } from "vue";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import AIModel = API.AIModel;

import {
  createModelUsingPost,
  updateModelUsingPut,
} from "@/servers/api/aiModelController.ts";
import { listPlatformsUsingGet } from "@/servers/api/aiPlatformController.ts";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<AIModel>{});

const platformList = ref();
const getPlatformList = async () => {
  const res = await listPlatformsUsingGet();
  if (res.code === 200) {
    platformList.value = res.data;
  }
};
getPlatformList();

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: AIModel) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
  };
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      responseData = await updateModelUsingPut(formData.value);
      console.log(formData.value);
    } else {
      // 新建
      responseData = await createModelUsingPost(formData.value);
      console.log(formData.value);
    }
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success("操作成功");
      emit("ok");
    } else {
      message.error(responseData.message);
    }
    emit("ok");
    visible.value = false;
    setTimeout(() => {
      // 重置表单
      formRef.value?.resetFields();
    }, 1000);
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

function handleCancel() {
  formRef.value?.resetFields();
  emit("cancel");
}

defineExpose({
  open,
});

// 数据
const isAiModalVisible = ref(false);
const aiPrompt = ref("");
const postContent = ref("");
const generating = ref(false);
</script>

<template>
  <a-drawer v-model:open="visible" :title="title" width="30%">
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item
        name="model_name"
        label="模型名称"
        :rules="[{ required: true, message: '请输入AI平台名称' }]"
      >
        <a-input v-model:value="formData.model_name" style="width: 270px" />
      </a-form-item>
      <a-form-item
        name="model_type"
        label="模型类型"
        :rules="[{ required: true, message: '请输入模型类型' }]"
      >
        <a-select v-model:value="formData.model_type" style="width: 180px">
          <a-select-option value="文本生成">文本生成</a-select-option>
          <a-select-option value="图片生成">图片生成</a-select-option>
          <a-select-option value="向量模型">向量模型</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="platform_id"
        label="所属平台"
        :rules="[{ required: true, message: '请输入所属平台' }]"
      >
        <a-select v-model:value="formData.platform_id" style="width: 180px">
          <a-select-option
            v-for="item in platformList"
            :key="item.id"
            :value="item.id"
          >
            <a-row>
              <div style="height: 32px">
                <img
                  :src="item.platform_image_url"
                  width="25px"
                  height="25px"
                  mr1
                />
              </div>
              <span style="height: 35px; line-height: 30px" ml1>{{
                item.platform_name
              }}</span>
            </a-row>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="api_key"
        label="ApiKey"
        :rules="[{ required: true, message: '请输入ApiKey' }]"
      >
        <a-input-password v-model:value="formData.api_key" />
      </a-form-item>
      <a-form-item
        name="rate"
        label="模型费用"
        :rules="[{ required: true, message: '请输入模型费用' }]"
      >
        <a-input-number
          :min="0"
          v-model:value="formData.rate"
          w-180px
          :step="0.01"
        />
        <span ml3>(1M / tokens)</span>
      </a-form-item>
      <a-form-item
        name="context_window"
        label="上下文数量"
        :rules="[{ required: true, message: '请输入上下文数量' }]"
      >
        <a-input v-model:value="formData.context_window" w-180px />
      </a-form-item>
      <a-form-item
        name="max_output_tokens"
        label="输出数量"
        :rules="[{ required: true, message: '请输入输出数量' }]"
      >
        <a-input v-model:value="formData.max_output_tokens" w-180px />
      </a-form-item>
      <a-form-item
        name="model_desc"
        label="模型描述"
        :rules="[{ required: true, message: '请输入模型描述' }]"
      >
        <a-textarea :rows="4" v-model:value="formData.model_desc" />
      </a-form-item>

      <a-form-item style="float: right" mt10>
        <a-button type="primary" @click="handleOk" mr3>确定</a-button>
        <a-button @click="handleCancel" mr-10>取消</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
