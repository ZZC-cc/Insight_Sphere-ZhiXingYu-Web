<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.getUserInfo();
  await userStore.getWebsiteInfo();
});
</script>
<style>
body {
  background-color: #f8f9fa;
}
</style>
