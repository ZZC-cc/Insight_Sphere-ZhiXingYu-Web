<script setup lang="ts">
import { UploadOutlined } from "@ant-design/icons-vue";

import { message } from "ant-design-vue";
import { useUserStore } from "@/stores/user.ts";
import { computed, reactive, ref } from "vue";
import User = API.User;
import { updateUserUserUsingPut } from "@/servers/api/userController.ts";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import router from "@/router";

const { userVO, getUserInfo } = useUserStore();

const formRef = ref();
const labelCol = { span: 0 };
const wrapperCol = { span: 13 };
const formState = reactive(<User>userVO);
const rules: any = computed(() => {
  return {
    name: [
      {
        required: true,
        message: "请填写姓名",
        trigger: "change",
      },
    ],
    username: [
      {
        required: true,
        message: "请填写用户名",
        trigger: "change",
      },
    ],

    mobile: [
      {
        required: true,
        message: "请填写手机号",
        trigger: "change",
      },
    ],
    address: [
      {
        required: true,
        message: "请填写地址",
        trigger: "change",
      },
    ],
    sex: [
      {
        required: true,
        message: "请选择性别",
        trigger: "change",
      },
    ],
    email: [
      {
        required: true,
        message: "请填写邮箱",
        trigger: "change",
      },
    ],
    desc: [
      {
        required: false,
        message: "请输入个人简介",
        trigger: "blur",
      },
    ],
  };
});

async function onSubmit() {
  try {
    await formRef.value.validate();
    const body = {
      user_id: formState.user_id,
      username: formState.username,
      email: formState.email,
      name: formState.name,
      sex: formState.sex,
      description: formState.description,
      address: formState.address,
      mobile: formState.mobile,
      avatar: formState.avatar,
    };
    const res = await updateUserUserUsingPut(body);
    if (res.code !== 200) {
      message.error(res.message);
      return;
    }
    message.success("个人资料更新成功,请重新登陆");
    localStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error("个人资料更新失败", error);

    message.error("个人资料更新失败");
  }
}

async function handleChange(info) {
  const uploadedFile = info.file.originFileObj;
  try {
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code === 200) {
      const avatarUrl = response.data;
      formState.avatar = avatarUrl;
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
  <a-card :title="'基本设置'" :bordered="false">
    <a-row>
      <a-col :span="12">
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item
            :label-col="{ span: 24 }"
            :label="'用户名'"
            name="username"
          >
            <a-input
              v-model:value="formState.username"
              :placeholder="'请输入用户名'"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 24 }" :label="'邮箱'" name="email">
            <a-input
              v-model:value="formState.email"
              :placeholder="'请输入邮箱'"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 24 }" :label="'姓名'" name="name">
            <a-input
              v-model:value="formState.name"
              :placeholder="'请输入姓名'"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item :label="'性别'" :label-col="{ span: 24 }" name="sex">
            <a-radio-group v-model:value="formState.sex">
              <a-radio value="男"> 男</a-radio>
              <a-radio value="女"> 女</a-radio>
              <a-radio value="保密"> 保密</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :label-col="{ span: 24 }"
            :label="'手机号'"
            name="phoneNumber"
          >
            <a-input
              v-model:value="formState.mobile"
              :placeholder="'请输入手机号'"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 24 }" :label="'地址'" name="address">
            <a-input
              v-model:value="formState.address"
              :placeholder="'请输入地址'"
              style="width: 320px"
            />
          </a-form-item>

          <a-form-item
            name="desc"
            :label="'个人简介'"
            :label-col="{ span: 24 }"
          >
            <a-textarea
              v-model:value="formState.description"
              :placeholder="'请输入个人简介'"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit"> 提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4">
        <p>头像</p>
        <div class="flex flex-col items-center">
          <a-avatar v-model:value="formState.avatar" :size="180">
            <template #icon>
              <img :src="formState.avatar" alt="" />
            </template>
          </a-avatar>
          <a-upload name="file" :file-list="[]" @change="handleChange">
            <a-button class="mt-6">
              <UploadOutlined />
              上传头像
            </a-button>
          </a-upload>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
