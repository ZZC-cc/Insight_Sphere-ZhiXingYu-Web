<script setup lang="ts">
import { message } from "ant-design-vue";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import RegisterModel from "@/views/common/login/model/RegisterModel.vue";
// eslint-disable-next-line no-undef
import LoginRequest = API.LoginRequest;
import {
  checkEmailUsingGet,
  getUserInfoUsingGet,
  loginByEmailUsingPost,
  loginUsingPost,
} from "@/servers/api/userController.ts";

const formState = reactive<LoginRequest>({});
const remember = ref(false);

import "@/utils/gt.js";
import { getWebsiteDetailsUsingGet } from "@/servers/api/webSiteController.ts";
import WebsiteVO = API.WebsiteVO;
import {
  initGeetestUsingGet,
  sendResetCodeForLoginUsingPost,
} from "@/servers/api/authController.ts";

let captchaObj: any;

// 登录函数
async function login() {
  // 检查 captchaObj 是否已初始化
  if (!captchaObj) {
    message.error("验证码尚未加载，请稍候再试！");
    return;
  }

  // 检查验证码是否已完成验证
  if (!captchaValidated.value) {
    message.error("请完成验证码！");
    return;
  }

  // 获取极验验证结果
  const result = captchaObj.getValidate();
  if (!result) {
    message.error("验证码数据获取失败，请重试！");
    return;
  }

  // 如果验证通过，将极验的三个参数添加到请求中
  formState.geetestChallenge = result.geetest_challenge;
  formState.geetestValidate = result.geetest_validate;
  formState.geetestSeccode = result.geetest_seccode;

  // 发送登录请求
  const res = await loginUsingPost(formState);
  if (res.code === 200) {
    message.success("登录成功！");
    const token = <string>res.data?.token;
    //获取用户信息
    if (remember.value) {
      // 记住我：将用户名、密码、token 存到 localStorage
      localStorage.setItem("remember", "true");
      localStorage.setItem("username", formState.username || "");
      localStorage.setItem("password", formState.password || "");
      localStorage.setItem("token", token);
    } else {
      // 不记住我：将 token 存到 sessionStorage
      sessionStorage.setItem("token", token);
    }
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  } else {
    message.error(res.message);
    captchaObj.reset(); // 重置验证码
    captchaValidated.value = false; // 重置验证通过的状态
  }
}

// 页面加载时自动填充账号和密
const registerModelRef = ref();

function handleOpen() {
  registerModelRef.value?.open();
}

const Website = reactive<WebsiteVO>({
  site_name: "",
  site_description: "",
  logo_url: "",
  footer_info: "",
  visit_count: 0,
});

onMounted(async () => {
  initGeetestCaptcha();
  // 获取网站详情
  const res = await getWebsiteDetailsUsingGet();
  if (res.code == 200) {
    Object.assign(Website, res.data);
  } else {
    message.error("获取网站信息失败");
  }
});

// 添加状态变量
const captchaReady = ref(false); // 验证码是否加载完成
const captchaValidated = ref(false); // 验证码是否验证通过

const initGeetestCaptcha = async () => {
  try {
    const res = await initGeetestUsingGet();

    if (res.code === 200) {
      console.log(res);
      const data = JSON.parse(res.data);
      console.log(data);
      const { gt, challenge, success, new_captcha } = data;

      // 使用 window.initGeetest
      window.initGeetest(
        {
          gt,
          challenge,
          new_captcha,
          offline: !success,
          product: "float", // 根据您的需求选择 'embed'、'float' 或 'popup'
          width: "100%",
        },
        (obj: any) => {
          captchaObj = obj;
          obj.appendTo("#captchaBox");

          obj.onReady(() => {
            // 验证码加载完成
            captchaReady.value = true;
          });

          obj.onSuccess(() => {
            // 验证码验证成功
            captchaValidated.value = true;
          });
        }
      );
    } else {
      console.error("极验初始化失败");
      message.error("极验初始化失败");
    }
  } catch (error) {
    console.error("网络错误，无法初始化极验行为验证:", error);
    message.error("网络错误，无法初始化极验行为验证");
  }
};

function onTabChange(key: string) {
  if (key === "2") {
    nextTick(() => {
      initEmailGeetestCaptcha();
    });
  }
}

// 页面加载时自动填充账号和密码
onMounted(() => {
  // 检查“记住我”状态
  const isRemembered = localStorage.getItem("remember") == "true";

  if (isRemembered) {
    // 填充 localStorage 中的账号和密码
    formState.username = localStorage.getItem("username") || "";
    formState.password = localStorage.getItem("password") || "";
    remember.value = true; // 勾选“记住我”
  } else {
    // 填充 sessionStorage 中的账号和密码
    formState.username = "";
    formState.password = "";
    remember.value = false; // 不勾选“记住我”
  }
});

// 邮箱登录表单状态
const emailFormState = reactive({
  email: "",
  code: "",
  geetestChallenge: "",
  geetestValidate: "",
  geetestSeccode: "",
});

// 状态变量
const loadingSendCode = ref(false);
const countdown = ref(0);
let timer: number | null = null;
const emailCaptchaReady = ref(false);
const emailCaptchaValidated = ref(false);
let emailCaptchaObj: any;

// 校验邮箱是否存在
const checkEmailExist = async () => {
  if (!emailFormState.email) return;
  try {
    const res = await checkEmailUsingGet({ email: emailFormState.email });
    if (res.code === 200 && !res.data) {
      message.warning("邮箱未注册，请先注册！");
    }
  } catch (error) {
    message.error("邮箱校验失败，请稍后重试！");
  }
};

// 初始化极验验证码
const initEmailGeetestCaptcha = async () => {
  try {
    const res = await initGeetestUsingGet();
    if (res.code === 200) {
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
          emailCaptchaObj = obj;
          obj.appendTo("#emailCaptchaBox");

          obj.onReady(() => {
            emailCaptchaReady.value = true;
          });

          obj.onSuccess(() => {
            emailCaptchaValidated.value = true;
            const result = emailCaptchaObj.getValidate();
            emailFormState.geetestChallenge = result.geetest_challenge;
            emailFormState.geetestValidate = result.geetest_validate;
            emailFormState.geetestSeccode = result.geetest_seccode;
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
  if (!emailCaptchaValidated.value) {
    message.error("请先完成极验验证！");
    return;
  }

  try {
    loadingSendCode.value = true;
    await sendResetCodeForLoginUsingPost({
      email: emailFormState.email,
      geetestChallenge: emailFormState.geetestChallenge,
      geetestValidate: emailFormState.geetestValidate,
      geetestSeccode: emailFormState.geetestSeccode,
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

// 邮箱登录逻辑
const loginWithEmail = async () => {
  if (!emailFormState.email || !emailFormState.code) {
    message.error("请输入完整信息！");
    return;
  }

  try {
    const res = await loginByEmailUsingPost({
      email: emailFormState.email,
      code: emailFormState.code,
    });
    if (res.code === 200) {
      message.success("登录成功！");
      localStorage.setItem("token", res.data?.token<String>);
      window.location.href = "/";
    } else {
      message.error(res.message);
    }
  } catch (error) {
    message.error("登录失败，请稍后重试！");
  }
};

// 清理定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="home" style="height: 60vh">
    <div class="soft-tech-gradient-background"></div>
    <a-card
      style="
        margin: 25vh auto;
        width: 90vh;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(91, 91, 91, 0.4); /* 添加的阴影效果 */
        transition: box-shadow 0.1s ease-in-out; /* 使阴影平滑过渡 */
      "
    >
      <template #title>
        <a-row
          style="
            float: left;
            height: 80px;
            line-height: 40px;
            padding: 15px 0px 20px 0px;
          "
        >
          <div>
            <img
              :src="Website.logo_url"
              style="width: 50px; border-radius: 2px"
            />
          </div>

          <div style="font-size: 32px; margin-left: 15px; margin-top: 10px">
            {{ Website.site_name }}
          </div>
          <div
            style="
              font-size: 14px;
              color: #a1a1a1;
              font-weight: initial;
              margin-left: 10px;
              margin-top: 20px;
            "
          >
            {{ Website.site_description }}
          </div>
        </a-row>
      </template>
      <a-card-grid
        :span="14"
        style="float: left; width: 60%; border-radius: 0 0 0px 10px"
        :hoverable="false"
      >
        <img
          :src="Website.cover_url"
          style="height: 500px; margin: 0px auto; display: block"
        />
      </a-card-grid>
      <a-card-grid
        :span="8"
        style="width: 40%; border-radius: 0 0 10px 0px"
        :hoverable="false"
      >
        <div
          style="
            margin: 0 auto;
            font-size: 24px;
            padding: 10px 0px;
            text-align: center;
          "
        >
          欢迎使用本系统
        </div>
        <!-- 使用Flexbox进行布局 -->
        <div style="margin: 0 auto; text-align: center; width: 80%">
          <a-tabs default-active-key="1" @change="onTabChange">
            <a-tab-pane key="1">
              <template #tab>
                <div style="padding: 0 20px">账号密码登录</div>
              </template>
              <a-form
                :model="formState"
                name="normal_login"
                class="login-form"
                style="margin-top: 10px"
              >
                <a-form-item
                  name="username"
                  :rules="[{ required: true, message: '请输入账号或手机号！' }]"
                >
                  <a-input
                    v-model:value="formState.username"
                    size="large"
                    placeholder="账号或手机号"
                  >
                    <template #prefix>
                      <UserOutlined class="site-form-item-icon" />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item
                  name="password"
                  :rules="[{ required: true, message: '请输入密码！' }]"
                >
                  <a-input-password
                    v-model:value="formState.password"
                    size="large"
                    placeholder="密码"
                  >
                    <template #prefix>
                      <LockOutlined class="site-form-item-icon" />
                    </template>
                  </a-input-password>
                </a-form-item>
                <a-form-item>
                  <a-form-item name="remember" no-style>
                    <!-- 极验验证码组件 -->
                    <div id="captchaBox" style="margin-bottom: 20px"></div>
                    <a-checkbox v-model:checked="remember">记住我</a-checkbox>
                  </a-form-item>
                  <a class="login-form-forgot" href="">忘记密码</a>
                </a-form-item>
                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button"
                    @click="login"
                    :disabled="!captchaReady"
                    style="width: 90%"
                  >
                    立即登录
                  </a-button>
                  <br />
                  Or
                  <a @click="handleOpen">现在注册! </a>
                </a-form-item>
              </a-form>
              <RegisterModel ref="registerModelRef" />
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #tab>
                <div style="padding: 0 20px">邮箱验证登录</div>
              </template>
              <a-form
                :model="emailFormState"
                name="email_login"
                class="login-form"
                style="margin-top: 10px"
              >
                <!-- 邮箱输入框 -->
                <a-form-item
                  name="email"
                  :rules="[{ required: true, message: '请输入邮箱！' }]"
                >
                  <a-input
                    v-model:value="emailFormState.email"
                    placeholder="请输入邮箱"
                    @blur="checkEmailExist"
                    size="large"
                  >
                    <template #prefix>
                      <MailOutlined class="site-form-item-icon" />
                    </template>
                  </a-input>
                </a-form-item>

                <!-- 验证码输入框 -->
                <a-form-item
                  name="code"
                  :rules="[{ required: true, message: '请输入验证码！' }]"
                >
                  <a-row gutter="8">
                    <a-col span="16">
                      <a-input
                        v-model:value="emailFormState.code"
                        size="large"
                        placeholder="请输入验证码"
                      />
                    </a-col>
                    <a-col span="8">
                      <a-button
                        h-9
                        :loading="loadingSendCode"
                        :disabled="countdown > 0"
                        @click="sendCode"
                      >
                        {{
                          countdown > 0 ? countdown + "s 后重发" : "发送验证码"
                        }}
                      </a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
                <div id="emailCaptchaBox" mt1 mb4></div>

                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button"
                    @click="loginWithEmail"
                    :disabled="!emailCaptchaValidated"
                    style="width: 90%"
                  >
                    邮箱登录
                  </a-button>
                  <br />
                  Or
                  <a @click="handleOpen">现在注册! </a>
                </a-form-item>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card-grid>
    </a-card>
  </div>
</template>
<!-- 引入 particles.js 的 CDN -->

<style scoped>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #c8eeec;
  top: 0;
  left: 0;
  z-index: 0;
}

.soft-tech-gradient-background {
  opacity: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    45deg,
    rgba(155, 142, 252, 0.4),
    rgba(252, 210, 195, 0.4),
    rgba(137, 234, 251, 0.4),
    rgba(222, 238, 166, 0.4)
  );
  background-size: 400% 400%;
  animation: gradientAnimation 9s ease infinite;
  z-index: -10; /* 更低的 z-index 确保背景在最底层 */
  pointer-events: none; /* 禁止背景影响页面交互 */
}

/* 渐变动画效果 */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
