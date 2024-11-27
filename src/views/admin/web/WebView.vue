<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getWebsiteDetailsUsingGet,
  updateWebsiteDetailsUsingPut,
} from "@/servers/api/webSiteController.ts";
import { uploadFileUsingPost } from "@/servers/api/fileController.ts";
import { message, Drawer, Form, Input, Button, Upload } from "ant-design-vue";
import {
  UploadOutlined,
  EditOutlined,
  CloseCircleTwoTone,
  PlusOutlined,
} from "@ant-design/icons-vue";
import router from "@/router";
import WebsiteVO = API.WebsiteVO;

// 网站数据
const Website = reactive<WebsiteVO>({
  site_name: "",
  site_description: "",
  cover_url: "",
  logo_url: "",
  footer_info: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  features: [], // 新增字段：网站特点
});
const editing = ref(false);

onMounted(async () => {
  const res = await getWebsiteDetailsUsingGet();
  if (res.code === 200) {
    Object.assign(Website, res.data);
  } else {
    message.error("获取网站信息失败");
  }
});

async function updateWebsiteDetails() {
  const res = await updateWebsiteDetailsUsingPut(Website);
  if (res.code === 200) {
    message.success("更新网站信息成功");
    const res = await getWebsiteDetailsUsingGet();
    Object.assign(Website, res.data);
    editing.value = false;
  } else {
    message.error("更新网站信息失败");
  }
}

// 处理 logo 上传
async function handleLogoUpload(info) {
  const uploadedFile = info.file.originFileObj;
  try {
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code === 200) {
      Website.logo_url = response.data;
      message.success("Logo 上传成功");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("Logo 上传失败");
  }
}

// 处理主图上传
async function handleCoverUpload(info) {
  const uploadedFile = info.file.originFileObj;
  try {
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code === 200) {
      Website.cover_url = response.data;
      message.success("主图上传成功");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("主图上传失败");
  }
}

// 新增和删除特点描述
function addFeature() {
  Website.features.push({ icon: "", title: "", content: "" });
}

function removeFeature(index: number) {
  Website.features.splice(index, 1);
}
</script>

<template>
  <a-card class="main">
    <a-row>
      <a-col span="7" ml-10>
        <div>
          <a-row>
            <a-image :src="Website.logo_url" width="80px" />
            <div ml4 class="font-600 text-28px mt-5">
              {{ Website.site_name }}
            </div>
          </a-row>
        </div>
        <div mt-10>
          <strong>网站描述：</strong>{{ Website.site_description }}
        </div>
        <div mt-10><strong>页脚信息：</strong> {{ Website.footer_info }}</div>
        <div mt-10>
          <strong>网站主图：</strong>
          <a-image :src="Website.cover_url" width="400px" />
        </div>
        <div mt-10><strong>公司名称：</strong>{{ Website.contact_name }}</div>
        <div mt-10><strong>公司邮箱：</strong>{{ Website.contact_email }}</div>
        <div mt-10>
          <strong>公司联系方式：</strong>{{ Website.contact_phone }}
        </div>
        <div mt-10>
          <strong>公司联系地址：</strong>{{ Website.contact_address }}
        </div>
      </a-col>
      <a-col span="15">
        <!-- 显示网站特点 -->
        <div>
          <h3>网站特点</h3>
          <a-row gutter="16">
            <a-col
              span="8"
              v-for="(feature, index) in Website.features"
              :key="index"
              p-3
            >
              <a-card :title="feature.title" hoverable>
                <div style="font-size: 24px">{{ feature.icon }}</div>
                <p>{{ feature.content }}</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
        <div mt-30>
          <a-button type="primary" @click="editing = true" class="w-100px">
            <EditOutlined />
            编辑
          </a-button>
        </div>
      </a-col>
    </a-row>

    <!-- 编辑网站信息 -->
    <a-drawer
      title="编辑网站信息"
      :visible="editing"
      @close="editing = false"
      width="1000"
    >
      <a-form-item label="网站 Logo">
        <a-image
          v-if="Website.logo_url"
          :src="Website.logo_url"
          width="80px"
          height="80px"
          style="border-radius: 8px"
        />
        <a-upload name="file" :file-list="[]" @change="handleLogoUpload">
          <a-button mt-4 ml-3>
            <UploadOutlined />
            <span>上传 Logo</span>
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="网站主图">
        <a-image
          v-if="Website.cover_url"
          :src="Website.cover_url"
          width="200px"
          style="border-radius: 8px"
        />
        <a-upload name="file" :file-list="[]" @change="handleCoverUpload">
          <a-button class="mt-4" ml-3>
            <UploadOutlined />
            <span>上传主图</span>
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form :model="Website" layout="vertical">
        <a-form-item label="网站名称">
          <a-input v-model:value="Website.site_name" />
        </a-form-item>
        <a-form-item label="网站描述">
          <a-input v-model:value="Website.site_description" />
        </a-form-item>
        <a-form-item label="页脚信息">
          <a-input v-model:value="Website.footer_info" />
        </a-form-item>
        <a-form-item label="公司名称">
          <a-input v-model:value="Website.contact_name" />
        </a-form-item>
        <a-form-item label="公司邮箱">
          <a-input v-model:value="Website.contact_email" />
        </a-form-item>
        <a-form-item label="公司联系方式">
          <a-input v-model:value="Website.contact_phone" />
        </a-form-item>
        <a-form-item label="公司联系地址">
          <a-input v-model:value="Website.contact_address" />
        </a-form-item>
        <!-- 编辑网站特点 -->
        <a-form-item label="网站特点">
          <a-button type="primary" @click="addFeature" mb-5>
            <PlusOutlined />
            新增特点
          </a-button>
          <div
            v-for="(feature, index) in Website.features"
            :key="index"
            style="margin-bottom: 20px"
          >
            <a-input
              v-model:value="feature.icon"
              placeholder="特点图标"
              style="width: 6%; margin-right: 10px"
            />
            <a-input
              v-model:value="feature.title"
              placeholder="特点标题"
              style="width: 20%; margin-right: 10px"
            />
            <a-input
              v-model:value="feature.content"
              placeholder="特点内容"
              style="width: 64%; margin-right: 10px"
            />
            <a-popconfirm
              title="确定要删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="removeFeature(index)"
            >
              <CloseCircleTwoTone style="color: red" />
            </a-popconfirm>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="updateWebsiteDetails"
            class="w-100px mr-10"
            >保存
          </a-button>
          <a-button type="default" @click="editing = false" class="w-100px">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </a-card>
</template>

<style scoped>
.main {
  padding-top: 20px;
  padding-left: 50px;
  min-height: 75vh;
  width: 180vh;
}

a-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
