<template>
  <div class="forgot-password-container" mt10>
    <a-card title="忘记密码" :bordered="false" style="width: 400px">
      <a-form :model="formState" @finish="handleSubmit">
        <!-- 邮箱输入框 -->
        <a-form-item
          name="email"
          :rules="[
            {
              required: true,
              type: 'email',
              message: '请输入有效的邮箱地址！',
            },
          ]"
        >
          <a-input v-model:value="formState.email" placeholder="请输入邮箱">
            <template #prefix>
              <MailOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <!-- 邮件验证码输入框 -->
        <a-form-item
          name="code"
          :rules="[
            {
              required: true,
              message: '请输入邮件验证码！',
            },
          ]"
        >
          <a-row gutter="8">
            <a-col span="16">
              <a-input
                v-model:value="formState.code"
                placeholder="请输入邮件验证码"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input>
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
            <!-- 极验验证码 -->
          </a-row>
          <div id="captchaBox" mt5></div>
        </a-form-item>

        <!-- 新密码输入框 -->
        <a-form-item
          name="newPassword"
          :rules="[
            {
              required: true,
              message: '请输入新密码！',
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.newPassword"
            placeholder="请输入新密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 确认密码输入框 -->
        <a-form-item
          name="confirmNewPassword"
          :rules="[
            {
              required: true,
              message: '请确认新密码！',
            },

            {
              validator: (rule, value, callback) => {
                if (value !== formState.newPassword) {
                  callback(new Error(`两次密码输入不一致！`));
                } else {
                  callback();
                }
              },
              trigger: `blur`,
            },
          ]"
        >
          <a-input-password
            v-model:value="formState.confirmNewPassword"
            placeholder="请再次输入新密码"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loadingSubmit"
            block
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onUnmounted, onMounted } from "vue";
import { message } from "ant-design-vue";
import { MailOutlined, LockOutlined } from "@ant-design/icons-vue";
import "@/utils/gt.js";
import {
  resetPasswordUsingPost,
  sendResetCodeUsingPost,
} from "@/servers/api/authController.ts";
import router from "@/router";
import { initGeetestUsingGet } from "@/servers/api/authController.ts";

let captchaObj: any;

// 表单状态
const formState = reactive({
  email: "",
  code: "",
  newPassword: "",
  confirmNewPassword: "",
  geetestChallenge: "",
  geetestValidate: "",
  geetestSeccode: "",
});

// 状态变量
const loadingSendCode = ref(false);
const loadingSubmit = ref(false);
const captchaReady = ref(false);
const captchaValidated = ref(false);
const countdown = ref(0);
let timer: number | null = null;

// 初始化极验验证码
const initGeetestCaptcha = async () => {
  try {
    const res = await initGeetestUsingGet();
    console.log(res);
    if (res.code == 200) {
      const { gt, challenge, success, new_captcha } = JSON.parse(res.data);
      window.initGeetest(
        {
          gt,
          challenge,
          new_captcha,
          offline: !success,
          product: "float",
          width: "100%",
        },
        (obj: any) => {
          captchaObj = obj;
          obj.appendTo("#captchaBox");

          obj.onReady(() => {
            captchaReady.value = true;
          });

          obj.onSuccess(() => {
            captchaValidated.value = true;
            const result = captchaObj.getValidate();
            formState.geetestChallenge = result.geetest_challenge;
            formState.geetestValidate = result.geetest_validate;
            formState.geetestSeccode = result.geetest_seccode;
          });
        }
      );
    } else {
      message.error("极验初始化失败！");
    }
  } catch (error) {
    message.error("极验加载失败，请检查网络！" + error);
  }
};

// 发送验证码逻辑
const sendCode = async () => {
  if (!captchaValidated.value) {
    message.error("请先完成极验验证！");
    return;
  }

  try {
    loadingSendCode.value = true;
    await sendResetCodeUsingPost({
      email: formState.email,
      geetestChallenge: formState.geetestChallenge,
      geetestValidate: formState.geetestValidate,
      geetestSeccode: formState.geetestSeccode,
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
    message.error("验证码发送失败，请重试！");
  } finally {
    loadingSendCode.value = false;
  }
};

// 提交表单逻辑
const handleSubmit = async () => {
  try {
    loadingSubmit.value = true;
    await resetPasswordUsingPost({
      email: formState.email,
      code: formState.code,
      newPassword: formState.newPassword,
    });
    message.success("密码重置成功，请使用新密码登录！");
    await router.push("/login");
    Object.keys(formState).forEach((key) => (formState[key] = ""));
  } catch (error) {
    message.error("密码重置失败，请检查输入信息！");
  } finally {
    loadingSubmit.value = false;
  }
};

// 清理定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

onMounted(() => {
  initGeetestCaptcha();
});
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  height: 100vh;
}
</style>
