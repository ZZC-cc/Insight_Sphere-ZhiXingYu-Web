<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const emits = defineEmits(["commentAdded"]);

import { deleteCommentUsingPost } from "@/servers/api/commentController.ts";
import CommentAddModel from "@/views/user/Post/comment-add-model.vue";

const showReply = ref(false);
const replyToId = ref("");
const postId = ref("");
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const Website = computed(() => userStore.websiteVO || {});

function showReplyForm(id: any) {
  showReply.value = !showReply.value;
  replyToId.value = id;
}

watch(postId, () => {
  handleCommentAdded();
});

function handleCommentAdded() {
  emits("commentAdded");
  showReply.value = !showReply.value;
}

async function deleteComment(id: any) {
  try {
    const response = await deleteCommentUsingPost({
      id,
    });
    if (response.code === 200) {
      message.success("删除成功");
      emits("commentAdded");
    } else {
      console.error("删除失败:", response.message);
    }
  } catch (error) {
    console.error("删除错误:", error);
  }
}
</script>

<script lang="ts">
import CommentVO = API.CommentVO;

export default {
  props: {
    comments: {
      type: Array as () => CommentVO[],
      required: true,
    },
  },
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "user":
      return "blue";
    case "vip":
      return "orange";
    default:
      return "default";
  }
};
</script>

<template>
  <div>
    <a-comment v-for="comment in comments" :key="comment.id">
      <template #actions>
        <span key="comment-nested-reply-to">
          <span>{{ comment.createTime }} &nbsp;&nbsp;</span>
          <span>
            <MessageOutlined />&nbsp;
            <a @click="showReplyForm(comment.id)">回复</a>&nbsp;&nbsp;
          </span>
          <span v-if="comment.user?.user_id === User.user_id">
            <a-popconfirm
              title="确定删除吗？"
              @confirm="deleteComment(comment.id)"
            >
              <DeleteOutlined mr2 />
              <a style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </span>
      </template>
      <template #author>
        <a style="font-weight: 550; font-size: 14px">{{ comment.user.name }}</a>
        <a-tag
          :color="getRoleColor(comment.user.role)"
          style="font-weight: 550"
          ml-3
        >
          <span
            v-if="comment.user.role == 'admin'"
            :style="{ color: getRoleColor(comment.user.role) }"
            >管理员</span
          >
          <span v-if="comment.user.role == 'user'">普通用户</span>
          <span v-if="comment.user.role == 'vip'">vip会员</span>
        </a-tag>
      </template>
      <template #avatar>
        <a-avatar :src="comment.user.avatar" :alt="comment.user.name" />
      </template>
      <template #content>
        <p>{{ comment.content }}</p>
      </template>
      <CommentAddModel
        v-if="showReply && comment.id === replyToId"
        :post-id="comment.post_id"
        :parent-id="comment.id"
        :root-parent-id="comment.root_parent_id"
        :reply-name="comment.user?.name"
        @comment-added="handleCommentAdded()"
      />
      <!-- 递归渲染子评论 -->
      <CommentItem
        v-if="comment.child && comment.child.length"
        :comments="comment.child"
        style="margin: -30px 0"
        @comment-added="handleCommentAdded()"
      />
    </a-comment>
  </div>
</template>
