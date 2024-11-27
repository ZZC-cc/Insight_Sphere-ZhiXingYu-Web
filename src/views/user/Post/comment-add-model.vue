<!-- comment-add-model.vue -->
<script lang="ts" setup>
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import { addCommentUsingPost } from "@/servers/api/commentController.ts";

const props = defineProps<{
  postId: string;
  parentId: string;
  rootParentId: string;
  replyName: string;
}>();

const emits = defineEmits(["commentAdded"]);

import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});

const submitting = ref(false);
const value = ref("");
const placeholder = ref("欢迎发表善意的评论");
if (props.replyName) placeholder.value = `回复${props.replyName}`;

async function handleSubmit() {
  if (!value.value) return;

  submitting.value = true;

  try {
    const body = {
      content: value.value,
      parent_id: props.parentId,
      post_id: props.postId,
      root_parent_id: props.rootParentId,
      user_id: User.value?.user_id,
      user_name: name,
    };

    const response = await addCommentUsingPost(body);

    if (response.code === 200) {
      message.success("评论成功");
      value.value = "";
      emits("commentAdded");
    } else {
      console.error("Failed to add comment:", response.message);
    }
  } catch (error) {
    console.error("Failed to add comment:", error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <a-comment>
    <template #avatar>
      <a-avatar :src="User.avatar" />
    </template>
    <template #author>
      {{ User.name }}
    </template>
    <template #content>
      <a-form-item>
        <a-textarea
          v-model:value="value"
          :rows="4"
          :placeholder="placeholder"
          style="max-width: 600px"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          html-type="submit"
          :loading="submitting"
          type="primary"
          @click="handleSubmit"
        >
          发表评论
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>
