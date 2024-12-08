<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getWebsiteDetailsUsingGet } from "@/servers/api/webSiteController.ts";
import { message } from "ant-design-vue";
import WebsiteVO = API.WebsiteVO;

const websiteData = ref<WebsiteVO>({
  site_name: "ChatGPT",
});

onMounted(async () => {
  const res = await getWebsiteDetailsUsingGet();
  Object.assign(websiteData.value, res.data);
});
</script>

<template>
  <div class="main">
    <!-- 顶部标志和标题，带霓虹光效果的背景 -->
    <div class="header">
      <a-row :span="24" :wrap="false">
        <a-col :span="11.5" style="padding-left: 10%">
          <h1 mt-20 mb-8>
            <span class="title">{{
              websiteData.site_name.substring(0, 3)
            }}</span>
            <span text-12>{{ websiteData.site_name.substring(3) }}</span>
          </h1>
          <h1 style="font-size: 3.2em; margin-top: -30px">
            创新型AI智能学习与知识服务平台
          </h1>
          <p style="margin-top: -10px; color: #555; font-size: 22px">
            {{ websiteData.site_description }}
            <a-tag color="#4a64fb" style="font-size: 16px; font-weight: 550"
              >v0.0.1
            </a-tag>
          </p>
          <a-button
            type="primary"
            size="large"
            href="/AIChat"
            style="
              margin-top: 15px;
              width: 70px;
              border-radius: 50px;
              line-height: 25px;
              background-color: #4a64fb;
              font-weight: 550;
              font-size: 13px;
            "
            >开始
          </a-button>
          <a-button
            type="primary"
            size="large"
            href="/AIChat"
            style="
              margin-left: 10px;
              margin-top: 15px;
              width: 210px;
              border-radius: 50px;
              line-height: 25px;
              background-color: rgb(80, 87, 101);
              font-weight: 550;
              font-size: 13px;
            "
            >为什么选择{{ websiteData.site_name }}?
          </a-button>
        </a-col>
        <a-col :span="14" style="text-align: center">
          <div class="neon-logo-background" mt-10></div>
          <img :src="websiteData.cover_url" alt="Logo" class="logo" />
        </a-col>
      </a-row>
    </div>

    <!-- 主功能卡片区域 -->
    <div class="features">
      <a-card
        v-for="(feature, index) in websiteData.features"
        :key="index"
        class="feature-card"
        hoverable
      >
        <div
          style="
            width: 45px;
            height: 45px;
            border-radius: 3px;
            font-size: 22px;
            text-align: center;
            line-height: 45px;
            background-color: rgb(233, 246, 254);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          "
        >
          {{ feature.icon }}
        </div>
        <h2>{{ feature.title }}</h2>
        <p style="margin-top: -10px">{{ feature.content }}</p>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.main {
  max-width: 100vh;
  margin: 0 auto;
  //padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  //background-color: #f9f9f9;
}

.neon-logo-background {
  position: relative;
  display: inline-block;
  padding: 40px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(69, 130, 223, 0.59),
    rgba(226, 52, 185, 0.49),
    rgba(0, 242, 255, 0.52),
    rgba(255, 255, 255, 0)
  );
  width: 280px; /* 控制背景区域大小 */
  height: 280px;
  filter: blur(80px); /* 大量模糊处理，使过渡更加自然 */
  overflow: hidden;
}

/* 可以给 logo 元素增加一些间距，以避免被模糊效果影响 */
.logo {
  position: absolute;
  width: 450px;
  top: 20px;
  right: 20%;
}

.title {
  font-size: 1.8em;
  background: linear-gradient(90deg, #2802ff, #73dff5);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
}

.features {
  width: 95%;
  margin: 0 auto;
  margin-top: 60px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.feature-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: calc(33% - 20px);
  padding: 5px;
  //text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h2 {
  font-size: 1.5em;
  color: #007acc;
}

.feature-card p {
  color: #666;
  font-size: 1em;
}
</style>
