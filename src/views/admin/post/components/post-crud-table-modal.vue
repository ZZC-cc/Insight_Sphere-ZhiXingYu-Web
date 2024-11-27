<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";

import { message } from "ant-design-vue";
import User = API.User;

import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";

import PostVO = API.PostVO;
import PostUpdateRequest = API.PostUpdateRequest;
import { computed, ref } from "vue";
import {
  addPostUsingPost,
  generateContentUsingPost,
  updatePostUsingPost,
} from "@/servers/api/postController.ts";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<PostVO>{
  id: "",
  title: "",
  content: "",
  cover: "",
  tagList: [],
});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: PostVO) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
    tagList: [],
  };
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      // 更新
      console.log(formData.value.tagList);
      responseData = await updatePostUsingPost(formData.value);
      console.log(formData.value);
    } else {
      // 新建
      responseData = await addPostUsingPost(formData.value);
    }
    showTagInput.value = false;
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
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
  showTagInput.value = false;
}

defineExpose({
  open,
});

function handleTagClose(tag: string) {
  formData.value.tagList = formData.value.tagList.filter(
    (t: string) => t !== tag
  );
}

const tagInputValue = ref<string>("");

function handleTagInputConfirm() {
  const inputTag = tagInputValue.value.trim();
  if (inputTag && !formData.value.tagList.includes(inputTag)) {
    formData.value.tagList.push(inputTag);
    tagInputValue.value = "";
  }
}

const showTagInput = ref(false);

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
      formData.value.cover = response.data;
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

// 显示AI生成弹窗
const showAiModal = () => {
  isAiModalVisible.value = true;
};

// 取消AI生成
const handleAiCancel = () => {
  isAiModalVisible.value = false;
  aiPrompt.value = "";
};

// 调用AI生成文章
const handleAiGenerate = async () => {
  if (!aiPrompt.value.trim()) {
    message.warning("提示词不能为空！");
    return;
  }

  generating.value = true; // 设置加载状态

  try {
    const response = await generateContentUsingPost({ prompt: aiPrompt.value });
    if (response.code == 200) {
      formData.value.content = response.data; // 将生成的内容填充到编辑框
      message.success("文章生成成功！");
    } else {
      message.error("文章生成失败：" + response.message);
    }
  } catch (error) {
    message.error("调用AI服务失败，请稍后重试！");
  } finally {
    generating.value = false; // 重置加载状态
    isAiModalVisible.value = false;
    aiPrompt.value = "";
  }
};
</script>

<template>
  <a-drawer v-model:open="visible" :title="title" width="60%">
    <!-- 提示词输入框 -->
    <a-modal
      v-model:visible="isAiModalVisible"
      title="AI代写文章"
      @ok="handleAiGenerate"
      @cancel="handleAiCancel"
      ok-text="生成文章"
      cancel-text="取消"
      style="margin-top: 10%; margin-right: 50vh"
    >
      <a-textarea
        v-model:value="aiPrompt"
        placeholder="请输入提示词，例如：写一篇关于Vue3的入门教程"
        rows="4"
        :disabled="generating"
      />
      <template #footer>
        <a-button @click="handleAiCancel" :disabled="generating">取消</a-button>
        <a-button
          type="primary"
          @click="handleAiGenerate"
          :loading="generating"
        >
          {{ generating ? "生成中..." : "生成" }}
        </a-button>
      </template>
    </a-modal>
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item name="avatar" label="封面">
        <a-upload-dragger
          name="file"
          :file-list="[]"
          @change="handleChange"
          style="height: 300px; width: 400px"
        >
          <img
            v-if="formData.cover"
            :src="formData.cover"
            style="max-height: 200px"
          />
          <div v-else>
            <plus-outlined></plus-outlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item
        name="title"
        label="标题"
        :rules="[{ required: true, message: '请输入文章标题' }]"
      >
        <a-input v-model:value="formData.title" />
      </a-form-item>
      <!-- 标签编辑部分 -->
      <a-form-item name="tagList" label="标签" v-model:value="formData.tagList">
        <div class="mt-2">
          <template v-if="showTagInput">
            <a-tag
              v-for="(tag, index) in formData.tagList"
              :key="index"
              :closable="true"
              @close="handleTagClose(tag)"
            >
              {{ tag }}
            </a-tag>
            <a-input
              v-model:value="tagInputValue"
              @keyup.enter="handleTagInputConfirm"
              @blur="
                showTagInput = false;
                handleTagInputConfirm();
              "
              type="text"
              size="small"
              :style="{ width: '78px' }"
            />
          </template>
          <template v-else>
            <a-tag
              v-for="(tag, index) in formData.tagList"
              :key="index"
              :closable="true"
              @close="handleTagClose(tag)"
            >
              {{ tag }}
            </a-tag>
            <a-tag @click="showTagInput = true">
              <PlusOutlined />
            </a-tag>
          </template>
        </div>
      </a-form-item>
      <!-- 标签编辑部分结束 -->
      <a-form-item
        name="content"
        label="内容"
        :rules="[{ required: true, message: '请输入文章内容' }]"
      >
        <!-- AI代写按钮 -->
        <a-button type="primary" @click="showAiModal" mb-3>
          🤖 AI代写
        </a-button>
        <v-md-editor v-model="formData.content" height="50vh"></v-md-editor>
      </a-form-item>
      <a-form-item style="float: right" mt10>
        <a-button type="primary" @click="handleOk" mr3>确定</a-button>
        <a-button @click="handleCancel" mr-10>取消</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
