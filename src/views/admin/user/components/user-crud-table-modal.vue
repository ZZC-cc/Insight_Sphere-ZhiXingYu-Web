<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import {
  updateUserByAdminUsingPut,
  userCreateUsingPost,
} from "@/servers/api/userController.ts";
import { message } from "ant-design-vue";
import User = API.User;
import router from "@/router";
import { UploadOutlined } from "@ant-design/icons-vue";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import { computed, ref } from "vue";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<User>{});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: User) {
  visible.value = true;
  isUpdate.value = !!record?.user_id;
  formData.value = cloneDeep(record) ?? {};
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      // 更新用户
      responseData = await updateUserByAdminUsingPut(formData.value);
    } else {
      // 新建用户
      responseData = await userCreateUsingPost(formData.value);
    }

    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
      emit("ok");
      visible.value = false;
      setTimeout(() => {
        // 重置表单
        formRef.value?.resetFields();
      }, 1000);
    } else {
      message.error(responseData.message);
    }
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
      formData.value.avatar = response.data;
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
  <a-modal
    v-model:open="visible"
    :title="title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item name="avatar" label="头像">
        <a-image
          v-model:value="formData.avatar"
          :src="formData.avatar"
          width="100px"
          height="100px"
          style="border-radius: 50px"
        />
        <br />
        <a-upload name="file" :file-list="[]" @change="handleChange">
          <a-button class="mt-4">
            <UploadOutlined />
            <span>上传头像</span>
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input
          v-model:value="formData.username"
          :maxlength="50"
          placeholder="请输入用户名"
        />
      </a-form-item>
      <a-form-item
        name="password"
        label="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
        v-if="!isUpdate"
      >
        <a-input-password
          v-model:value="formData.password"
          :maxlength="50"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        name="name"
        label="昵称"
        :rules="[{ required: true, message: '请输入昵称' }]"
      >
        <a-input
          v-model:value="formData.name"
          :maxlength="50"
          placeholder="请输入昵称"
        />
      </a-form-item>
      <a-form-item
        name="sex"
        label="性别"
        :rules="[{ required: true, message: '请输入性别' }]"
      >
        <a-radio-group v-model:value="formData.sex">
          <a-radio value="保密">保密</a-radio>
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        name="role"
        label="角色"
        :rules="[{ required: true, message: '请输入角色' }]"
      >
        <a-select v-model:value="formData.role" placeholder="请选择角色">
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="user">用户</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="status"
        label="账号状态"
        :rules="[{ required: true, message: '请输入账号状态' }]"
      >
        <a-select v-model:value="formData.status" placeholder="请选择账号状态">
          <a-select-option value="1">1正常</a-select-option>
          <a-select-option value="0">0禁用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="mobile"
        label="手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <a-input
          v-model:value="formData.mobile"
          :maxlength="11"
          placeholder="请输入昵称"
        />
      </a-form-item>
      <a-form-item
        name="email"
        label="邮箱"
        :rules="[{ required: true, message: '请输入邮箱' }]"
      >
        <a-input
          v-model:value="formData.email"
          :maxlength="50"
          placeholder="请输入邮箱"
        />
      </a-form-item>
      <a-form-item
        name="address"
        label="地址"
        :rules="[{ required: true, message: '请输入地址' }]"
      >
        <a-textarea
          v-model:value="formData.address"
          show-count
          :maxlength="200"
          placeholder="请输入地址"
        />
      </a-form-item>
      <a-form-item
        name="description"
        label="个人简介"
        :rules="[{ required: false }]"
      >
        <a-textarea
          v-model:value="formData.description"
          show-count
          :maxlength="200"
          placeholder="请输入个人简介"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
