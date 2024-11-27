<script lang="ts" setup>
import { ref, watch } from "vue";
import { getCommentsByPostIdUsingGet } from "@/servers/api/commentController.ts";
import CommentItem from "@/views/user/Post/comment-Item.vue";
import CommentAddModel from "@/views/user/Post/comment-add-model.vue";

const props = defineProps<{
  postId: any;
}>();

const current = ref(1);

const comments = ref([]);
const postId = ref(props.postId);

// 获取评论
async function getComments() {
  try {
    if (!postId.value) return;
    const response = await getCommentsByPostIdUsingGet({
      postId: postId.value,
    });
    if (response.code === 200) comments.value = response.data || [];
    else console.error("Failed to get comments:", response.message);
  } catch (error) {
    console.error("Failed to get comments:", error);
  }
}

// 初始化获取评论
getComments();

// 监听评论变化
watch(postId, () => {
  getComments();
});
</script>

<template>
  <a-tabs>
    <a-tab-pane tab="评论">
      <div>
        <CommentItem
          :comments="comments"
          @comment-added="getComments(postId)"
        />
      </div>
      <CommentAddModel
        :post-id="postId"
        parent-id="0"
        root-parent-id="0"
        reply-name=""
        @comment-added="getComments(postId)"
      />
    </a-tab-pane>
  </a-tabs>
</template>
