<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";

import { message } from "ant-design-vue";
import User = API.User;

import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";

import { computed, ref } from "vue";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import AIPlatform = API.AIPlatform;
import {
  createPlatformUsingPost,
  updatePlatformUsingPut,
} from "@/servers/api/aiPlatformController.ts";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<AIPlatform>{});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: AIPlatform) {
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
      responseData = await updatePlatformUsingPut(formData.value);
      console.log(formData.value);
    } else {
      // 新建
      responseData = await createPlatformUsingPost(formData.value);
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

async function handleChange(info) {
  const uploadedFile = info.file.originFileObj;
  try {
    // 调用 uploadFileUsingPost 方法，传入参数 biz="avatar" 和文件对象
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code == 200) {
      formData.value.platform_image_url = response.data;
      message.success("文件上传成功");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("文件上传失败");
  }
}

// 数据
const isAiModalVisible = ref(false);
const aiPrompt = ref("");
const postContent = ref("");
const generating = ref(false);
</script>

<template>
  <a-drawer v-model:open="visible" :title="title" width="40%">
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item name="platform_image_url" label="logo">
        <a-upload-dragger
          name="file"
          :file-list="[]"
          @change="handleChange"
          style="height: 300px; width: 400px"
        >
          <img
            v-if="formData.platform_image_url"
            :src="formData.platform_image_url"
            style="max-height: 200px"
          />
          <div v-else>
            <plus-outlined></plus-outlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item
        name="platform_name"
        label="AI平台名称"
        :rules="[{ required: true, message: '请输入AI平台名称' }]"
      >
        <a-input v-model:value="formData.platform_name" />
      </a-form-item>
      <a-form-item
        name="platform_url"
        label="官网链接"
        :rules="[{ required: true, message: '请输入官网链接' }]"
      >
        <a-input v-model:value="formData.platform_url" />
      </a-form-item>
      <a-form-item
        name="platform_description"
        label="AI平台描述"
        :rules="[{ required: true, message: '请输入AI平台描述' }]"
      >
        <a-textarea v-model:value="formData.platform_description" />
      </a-form-item>

      <a-form-item
        name="api_url"
        label="基础接口"
        :rules="[{ required: true, message: '请输入基础接口' }]"
      >
        <a-input v-model:value="formData.api_url" />
      </a-form-item>
      <a-form-item style="float: right" mt10>
        <a-button type="primary" @click="handleOk" mr3>确定</a-button>
        <a-button @click="handleCancel" mr-10>取消</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
