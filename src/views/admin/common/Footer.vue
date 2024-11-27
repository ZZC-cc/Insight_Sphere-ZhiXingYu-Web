<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getWebsiteDetailsUsingGet } from "@/servers/api/webSiteController.ts";
import WebsiteVO = API.WebsiteVO;

const Website = ref(<WebsiteVO>[]);

onMounted(async () => {
  const res = await getWebsiteDetailsUsingGet();
  if (res.code == 200) {
    Website.value = res.data;
    console.log(res);
    console.log(Website);
  }
});
</script>

<template>
  <!-- 页脚 -->
  <div class="footer">{{ Website.footer_info }}</div>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 22px;
  background: #f0f2f5;
}
</style>
