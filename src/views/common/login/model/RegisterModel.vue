<script setup lang="ts">
import { ref } from "vue";
import { FormInstance, message } from "ant-design-vue";

const emit = defineEmits(["cancel", "ok"]);

const visible = ref(false);

const formRef = ref<FormInstance>();

const formData = ref<UserRegisterRequest>({});

function open() {
  visible.value = true;
}

async function handleOk() {
  try {
    await formRef.value?.validate();
    ccAxios.post("/query/user/register", formData.value).then((res: any) => {
      if (res.code == 200) {
        message.success(res.data);
      } else {
        message.error(res.data);
      }
    });

    emit("ok");
    visible.value = false;
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

function handleCancel() {
  formRef.value?.resetFields();
  emit("cancel");
}

// 自定义确认密码的验证规则
function validateConfirmPassword(_: any, value: string) {
  if (value !== formData.value.pass) {
    return Promise.reject(new Error("两次密码输入不一致"));
  }
  return Promise.resolve();
}

defineExpose({
  open,
});
</script>

<template>
  <a-modal
    v-model:open="visible"
    title="用户注册"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="确定"
    cancel-text="取消"
  >
    <a-form ref="formRef" :model="formData" ml-20px>
      <a-form-item
        name="name"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
        w-300px
      >
        <a-input
          v-model:value="formData.name"
          :maxlength="20"
          placeholder="请输入用户名"
        />
      </a-form-item>
      <a-form-item
        name="num"
        label="账号"
        :rules="[{ required: true, message: '请输入账号' }]"
        w-300px
      >
        <a-input
          v-model:value="formData.num"
          :maxlength="20"
          placeholder="请输入账号"
        />
      </a-form-item>
      <a-form-item
        name="pass"
        label="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
        w-300px
      >
        <a-input-password
          v-model:value="formData.pass"
          :maxlength="50"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        name="confirmPass"
        label="确认密码"
        :rules="[
          { required: true, message: '请再次输入密码' },
          { validator: validateConfirmPassword },
        ]"
        w-300px
      >
        <a-input-password
          v-model:value="formData.confirmPass"
          :maxlength="50"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item
        name="sex"
        label="性别"
        :rules="[{ required: true, message: '请输入性别' }]"
      >
        <a-radio-group v-model:value="formData.sex">
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
          <a-radio value="保密">保密</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>
