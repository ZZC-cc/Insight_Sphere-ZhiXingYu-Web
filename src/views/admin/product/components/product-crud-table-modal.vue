<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";

import ProductUpdateRequest = API.ProductUpdateRequest;
import { computed, ref } from "vue";
import {
  addProductUsingPost,
  updateProductUsingPost,
} from "@/servers/api/productController.ts";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import ProductVO = API.ProductVO;

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<ProductUpdateRequest>{});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: ProductVO) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
    tags: [],
  };
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    formData.value.tags = JSON.stringify(formData.value.tags);
    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      // 更新
      responseData = await updateProductUsingPost(formData.value);
    } else {
      // 新建
      responseData = await addProductUsingPost(formData.value);
    }
    showTagInput.value = false;
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
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
  formData.value.tags = formData.value.tags.filter((t: string) => t !== tag);
}

const tagInputValue = ref<string>("");

function handleTagInputConfirm() {
  const inputTag = tagInputValue.value.trim();
  if (inputTag && !formData.value.tags.includes(inputTag)) {
    formData.value.tags.push(inputTag);
    tagInputValue.value = "";
  }
}

const showTagInput = ref(false);

async function handleChange(info: any) {
  const uploadedFile = info.file.originFileObj;
  try {
    // 调用 uploadFileUsingPost 方法，传入参数 biz="avatar" 和文件对象
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code == 200) {
      formData.value.images = response.data;
      message.success("文件上传成功");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("文件上传失败");
  }
}
</script>

<template>
  <a-drawer
    v-model:open="visible"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
    width="60%"
  >
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item
        name="images"
        label="教程封面"
        :rules="[{ required: true, message: '请上传教程封面' }]"
      >
        <a-upload-dragger
          name="file"
          :file-list="[]"
          @change="handleChange"
          style="height: 300px; width: 400px"
        >
          <img
            v-if="formData.images"
            :src="formData.images"
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
        label="教程标题"
        :rules="[{ required: true, message: '请输入文章标题' }]"
      >
        <a-input v-model:value="formData.title" />
      </a-form-item>
      <!-- 标签编辑部分 -->
      <a-form-item name="tags" label="教程标签" v-model:value="formData.tags">
        <div class="mt-2">
          <template v-if="showTagInput">
            <a-tag
              v-for="(tag, index) in formData.tags"
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
              v-for="(tag, index) in formData.tags"
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
      <a-form-item
        name="buyNum"
        label="购买数量"
        :rules="[{ required: true, message: '请输入购买数量' }]"
      >
        <a-input-number v-model:value="formData.buyNum" :min="0" />
      </a-form-item>
      <a-form-item
        name="viewsNum"
        label="浏览量"
        :rules="[{ required: true, message: '请输入浏览量' }]"
      >
        <a-input-number v-model:value="formData.viewsNum" :min="0" />
      </a-form-item>
      <a-form-item
        name="price"
        label="教程价格"
        :rules="[{ required: true, message: '请输入教程价格' }]"
      >
        <a-input-number v-model:value="formData.price" :min="0" :max="100000" />
      </a-form-item>
      <a-form-item
        name="stock"
        label="教程库存"
        :rules="[{ required: true, message: '请输入教程库存' }]"
      >
        <a-input-number v-model:value="formData.stock" :min="0" :max="9999" />
      </a-form-item>
      <a-form-item
        name="isShelves"
        label="教程状态"
        :rules="[{ required: true, message: '请选择教程状态' }]"
        v-if="isUpdate"
      >
        <a-radio-group v-model:value="formData.isShelves">
          <a-radio :value="0">下架</a-radio>
          <a-radio :value="1">上架</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 标签编辑部分结束 -->
      <a-form-item
        name="description"
        label="教程描述"
        :rules="[{ required: true, message: '请输入教程描述' }]"
      >
        <a-textarea
          v-model:value="formData.description"
          style="height: 100%"
          show-count
        />
      </a-form-item>
      <a-form-item
        name="content"
        label="教程内容"
        :rules="[{ required: true, message: '请输入教程内容' }]"
      >
        <v-md-editor v-model="formData.content" height="50vh"></v-md-editor>
      </a-form-item>
      <a-form-item style="float: right; padding-bottom: 50px" mt5 mr10>
        <a-button type="primary" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel" ml5>取消</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
