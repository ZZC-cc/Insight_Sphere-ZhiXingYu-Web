<template>
  <a-modal
    v-model:open="visible"
    title="用户注册"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="注册"
    cancel-text="取消"
    width="550px"
  >
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
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
      >
        <a-input-password
          v-model:value="formData.password"
          :maxlength="50"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        name="pass"
        label="确认密码"
        :rules="[
          { required: true, message: '请再次输入密码' },
          { validator: validateConfirmPassword },
        ]"
      >
        <a-input-password
          v-model:value="formData.pass"
          :maxlength="50"
          placeholder="请再次输入密码"
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
        name="mobile"
        label="手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <a-input
          v-model:value="formData.mobile"
          :maxlength="11"
          placeholder="请输入手机号"
          @blur="checkPhoneExist"
        />
      </a-form-item>
      <a-form-item
        name="email"
        label="邮箱"
        :rules="[{ required: true, message: '请输入邮箱' }]"
      >
        <a-row gutter="8">
          <a-col span="16">
            <a-input
              v-model:value="formData.email"
              placeholder="请输入邮箱"
              @blur="checkEmailExist"
            />
          </a-col>
          <a-col span="8">
            <a-button
              :loading="loadingSendCode"
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? countdown + "s 后重发" : "发送验证码" }}
            </a-button>
          </a-col>
        </a-row>
        <div :id="captchaId" style="margin-top: 20px"></div>
      </a-form-item>
      <a-form-item
        name="code"
        label="验证码"
        :rules="[{ required: true, message: '请输入邮箱验证码' }]"
      >
        <a-input
          v-model:value="formData.code"
          :maxlength="6"
          placeholder="请输入验证码"
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

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";
import { FormInstance, message } from "ant-design-vue";
import "@/utils/gt.js";
import {
  checkEmailUsingGet,
  checkPhoneUsingGet,
  userRegisterUsingPost,
} from "@/servers/api/userController.ts";
import {
  initGeetestUsingGet,
  sendResetCodeForRegisterUsingPost,
} from "@/servers/api/authController.ts";

// 表单状态
const formData = reactive({
  username: "",
  password: "",
  pass: "",
  email: "",
  code: "",
  geetestChallenge: "",
  geetestValidate: "",
  geetestSeccode: "",
});

const loadingSendCode = ref(false);
const loadingSubmit = ref(false);
const countdown = ref(0);
const captchaReady = ref(false);
const captchaValidated = ref(false);
let captchaObj: any;
let timer: number | null = null;

const formRef = ref<FormInstance>();
const visible = ref(false);

defineExpose({
  open,
});
// 为每个验证码组件生成唯一的 id
const captchaId = ref(`captcha-${Date.now()}`);

function open() {
  visible.value = true;
}

const handleCancel = () => {
  formRef.value?.resetFields();
  visible.value = false;
};

// 自定义密码验证规则
const validateConfirmPassword = (_: any, value: string) => {
  if (value !== formData.password) {
    return Promise.reject(new Error("两次密码输入不一致！"));
  }
  return Promise.resolve();
};

// 初始化极验验证码
const initGeetestCaptcha = async () => {
  try {
    const res = await initGeetestUsingGet();
    if (res.code === 200) {
      const { gt, challenge, success, new_captcha } = JSON.parse(res.data);
      window.initGeetest(
        {
          gt,
          challenge,
          offline: !success,
          product: "float",
          width: "100%",
        },
        (obj: any) => {
          captchaObj = obj;
          obj.appendTo(`#${captchaId.value}`);

          obj.onReady(() => {
            captchaReady.value = true;
          });

          obj.onSuccess(() => {
            captchaValidated.value = true;
            const result = captchaObj.getValidate();
            formData.geetestChallenge = result.geetest_challenge;
            formData.geetestValidate = result.geetest_validate;
            formData.geetestSeccode = result.geetest_seccode;
          });
        }
      );
    } else {
      message.error("极验初始化失败！");
    }
  } catch (error) {
    message.error("极验加载失败，请检查网络！");
  }
};

// 发送验证码
const sendCode = async () => {
  if (!captchaValidated.value) {
    message.error("请先完成极验验证！");
    return;
  }

  try {
    loadingSendCode.value = true;
    await sendResetCodeForRegisterUsingPost({
      email: formData.email,
      geetestChallenge: formData.geetestChallenge,
      geetestValidate: formData.geetestValidate,
      geetestSeccode: formData.geetestSeccode,
    });
    message.success("验证码已发送，请检查您的邮箱！");
    countdown.value = 60;

    timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value -= 1;
      } else {
        clearInterval(timer!);
        timer = null;
      }
    }, 1000);
  } catch (error) {
    message.error("验证码发送失败，请稍后再试！");
  } finally {
    loadingSendCode.value = false;
  }
};

// 提交注册
const handleOk = async () => {
  try {
    await formRef.value?.validate();
    loadingSubmit.value = true;
    await userRegisterUsingPost(formData);
    message.success("注册成功！");
    visible.value = false;
  } catch (error) {
    message.error("注册失败，请重试！");
  } finally {
    loadingSubmit.value = false;
  }
};

// 清理定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
// 监听 visible 的变化，在弹窗显示时加载验证码
watch(visible, async (newVal) => {
  if (newVal) {
    await initGeetestCaptcha();
  }
});

// 校验邮箱是否存在
const checkEmailExist = async () => {
  if (!formData.email) return;

  try {
    const res = await checkEmailUsingGet({ email: formData.email });
    if (res.code === 200 && res.data) {
      message.error("该邮箱已被注册！");
    }
  } catch (error) {
    message.error("邮箱校验失败，请稍后再试！");
  }
};

// 校验手机号是否存在
const checkPhoneExist = async () => {
  if (!formData.mobile) return;

  try {
    const res = await checkPhoneUsingGet({ phone: formData.mobile });
    if (res.code === 200 && res.data) {
      message.error("该手机号已被注册！");
    }
  } catch (error) {
    message.error("手机号校验失败，请稍后再试！");
  }
};
</script>
