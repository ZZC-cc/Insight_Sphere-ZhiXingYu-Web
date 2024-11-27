<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <div class="content">
      <a-row class="chat-interface">
        <!-- 左侧联系人列表和新建会话按钮 -->
        <a-col :span="6" class="contact-list">
          <div class="profile">
            <img
              src="@/assets/chatgpt.png"
              alt="profile"
              class="profile-image"
            />
            <h3>ChatGPT</h3>
          </div>
          <a-button
            type="primary"
            block
            @click="newConversation"
            class="new-conversation-button"
          >
            <FormOutlined />
            新建会话
          </a-button>
          <a-input-search placeholder="Search" class="search-bar" />
          <div class="contacts-container">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="contact-item"
              @click="loadChatSession(contact.id)"
            >
              <img :src="contact.avatar" alt="avatar" class="contact-avatar" />
              <div class="contact-info">
                <h4>{{ contact.name }}</h4>
                <p style="margin-top: 5px">{{ contact.lastMessage }}</p>
              </div>
              <span class="contact-time">{{ contact.time }}</span>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="renameConversation(contact.id)">
                      <span><EditOutlined mr3 />重命名</span>
                    </a-menu-item>
                    <a-menu-item danger @click="deleteConversation(contact.id)">
                      <span><DeleteOutlined mr3 />删除</span>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link" class="menu-button"> ⋮</a-button>
              </a-dropdown>
            </div>
          </div>
        </a-col>

        <!-- 右侧聊天窗口 -->
        <a-col :span="18" class="chat-window">
          <div class="chat-header">
            <img src="@/assets/chatgpt.png" alt="avatar" class="chat-avatar" />
            <div class="chat-header-info">
              <h4>{{ currentContactName }}</h4>
              <span>最后一次活动: {{ currentContactLastActive }}</span>
            </div>
            <a-select
              v-model:value="pendingModel"
              style="margin-left: auto; width: 150px"
            >
              <a-select-option value="gpt-3.5-turbo"
                >gpt-3.5-turbo
              </a-select-option>
              <a-select-option value="gpt-4">gpt-4</a-select-option>
              <a-select-option value="gpt-4o">gpt-4o</a-select-option>
              <a-select-option value="o1-mini">GPT-o1 mini</a-select-option>
              <a-select-option value="o1-preview">GPT-o1</a-select-option>
            </a-select>
          </div>

          <!-- 聊天消息列表 -->
          <div ref="messageContainer" class="chat-messages">
            <div
              class="message-item"
              v-for="message in messages"
              :key="message.id"
            >
              <img
                :src="message.avatar"
                alt="avatar"
                :class="[
                  'message-avatar',
                  message.sender === 'me' ? 'avatar-right' : 'avatar-left',
                ]"
              />
              <div
                :class="[
                  'message',
                  message.sender === 'me' ? 'my-message' : 'other-message',
                ]"
              >
                <!-- 使用 v-html 显示解析后的内容，并支持代码高亮 -->
                <div
                  v-if="message.isMarkdown"
                  class="code-block"
                  v-html="message.htmlContent"
                  style="border: none; background-color: rgba(255, 238, 238, 0)"
                ></div>
                <p v-else style="margin: 0">{{ message.text }}</p>
                <span class="message-time">{{ message.time }}</span>
              </div>
            </div>
            <a-spin v-if="isLoading" ml5 />
          </div>

          <div class="chat-input">
            <a-textarea
              v-model:value="newMessage"
              placeholder="给ChatGPT发送消息"
              class="input-box"
              @keyup.enter="sendMessage"
              :auto-size="{ minRows: 1, maxRows: 6 }"
            />
            <a-button type="primary" @click="sendMessage" :disabled="isLoading">
              <SendOutlined style="transform: rotate(-45deg)" />
              发送
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/views/user/common/Navbar.vue";
import Footer from "@/views/user/common/Footer.vue";
import { ref, nextTick, onMounted, watch, reactive, computed } from "vue";
import {
  SendOutlined,
  FormOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import hljs from "highlight.js";

// import "highlight.js/styles/magula.css";
// import "highlight.js/styles/tomorrow-night-blue.css";
import "highlight.js/styles/atom-one-dark.css";

import { marked } from "marked";

// 配置 marked，让它在解析代码时使用 highlight.js 进行高亮
marked.setOptions({
  highlight: function (code, lang) {
    return lang
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value;
  },
});

import {
  createChatUsingPost,
  getChatSessionsUsingGet,
  getChatMessagesUsingGet,
  sendMessageUsingPost,
  updateChatModelUsingPost,
  deleteChatSessionUsingPost,
  renameChatSessionUsingPost,
} from "@/servers/api/chatController.ts";
import CreateChatRequest = API.CreateChatRequest;
import UserMessageRequest = API.UserMessageRequest;
import { getUserInfoUsingGet } from "@/servers/api/userController.ts";

const AIAvatar =
  "https://zcc-1305301692.cos.ap-guangzhou.myqcloud.com/cclogo.png";

// 联系人列表数据
const contacts = ref([]);

// 聊天消息数据
const messages = ref([
  {
    id: 1,
    sender: "other",
    text: "有什么可以帮忙的？",
    time: new Date().toLocaleTimeString(),
    avatar: AIAvatar,
    isCode: false,
  },
]);

// 在监听 messages 的变化时，进行代码块高亮
watch(messages, async () => {
  await nextTick(); // 确保 DOM 完全更新后再执行代码块高亮
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });
});

// 当前输入的新消息
const newMessage = ref("");
const selectedModel = ref("gpt-3.5-turbo"); // 选中的模型
const pendingModel = ref(selectedModel.value); // 用于存储暂时选中的模型
const currentContactName = ref("新会话");
const currentContactLastActive = ref("1 小时前");

// 参考消息容器的 ref
const messageContainer = ref(null);
const sessionId = ref(null); // 存储会话ID

import { useUserStore } from "@/stores/user";
import UserVO = API.UserVO;

const userStore = useUserStore();
const User = computed(() => userStore.userVO<UserVO>);

// 获取历史会话列表
const fetchChatSessions = async (userId: any) => {
  try {
    const sessionRes = await getChatSessionsUsingGet({
      userId,
    });
    console.log("sessionRes", sessionRes);

    if (sessionRes.code == 200) {
      contacts.value = sessionRes.data?.map((session) => ({
        id: session.id,
        name: session.session_name || "未命名会话",
        lastMessage: session.summary,
        time: new Date(session.created_time).toLocaleString(),
        avatar: session.session_image,
        model: session.model, // 保存每个会话的模型信息
      }));
    } else {
      message.error("获取会话列表失败");
    }
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    message.error("获取会话列表失败");
  }
};

// onMounted
onMounted(async () => {
  if (User.value?.user_id) {
    await fetchChatSessions(User.value?.user_id);
  }
  await nextTick();
});

// 监听 selectedModel 的变化，当模型变化时更新 createChat.model
watch(selectedModel, (newModel) => {
  createChat.model = newModel;
  sendMessageRequest.model = newModel;
  if (sessionId.value) {
    updateConversationModel(sessionId.value, newModel); // 更新会话的模型
  }
});

const createChat = reactive<CreateChatRequest>({
  model: selectedModel.value,
  userId: User.value?.user_id,
});

const sendMessageRequest = reactive<UserMessageRequest>({
  model: selectedModel.value,
  content: "",
});

// 新建会话
const newConversation = async () => {
  try {
    const res = await createChatUsingPost(createChat);
    if (res.code == 200) {
      const chatSession = res.data;
      sessionId.value = chatSession?.id; // 保存会话ID
      messages.value = []; // 清空当前消息，开始新会话
      currentContactName.value = "新会话";
      currentContactLastActive.value = "1 分钟前";
    } else {
      message.error("创建会话失败");
    }
  } catch (error) {
    message.error("创建会话失败");
    console.error("Error creating new conversation:", error);
  }
};
const UpdateChatModelRequest = reactive<API.UpdateChatModelRequest>({});
// 更新会话的模型
const updateConversationModel = async (sessionId: any, model: string) => {
  UpdateChatModelRequest.model = model;
  UpdateChatModelRequest.id = sessionId;
  try {
    await updateChatModelUsingPost(UpdateChatModelRequest);
  } catch (error) {
    console.error("Error updating conversation model:", error);
    message.error("更新对话模型失败");
  }
};

const isLoading = ref(false);

const sendMessage = async () => {
  if (newMessage.value.trim() && !isLoading.value) {
    isLoading.value = true; // 开始加载

    // 如果会话 ID 为空，先创建会话
    if (!sessionId.value) {
      await newConversation(); // 创建新的会话
    }

    if (sessionId.value) {
      // 如果用户选择了新的模型，但还未生效，则在发送消息时一起更新
      if (pendingModel.value !== selectedModel.value) {
        try {
          await updateConversationModel(sessionId.value, pendingModel.value);
          selectedModel.value = pendingModel.value; // 同步更新当前选中的模型
        } catch (error) {
          message.error("更新模型失败，请稍后重试");
        }
      }

      // 添加用户消息到上下文
      messages.value.push({
        id: Date.now(),
        sender: "me",
        text: newMessage.value,
        htmlContent: marked(newMessage.value), // 使用 marked 解析为 HTML，支持代码高亮
        isMarkdown: false, // 标识为 Markdown
        time: new Date().toLocaleTimeString(),
        avatar: User.value?.avatar,
      });

      sendMessageRequest.content = newMessage.value;
      newMessage.value = "";

      // 滚动到底部
      await nextTick();
      scrollToBottom();

      // 等待后端的 ChatGPT 回复
      try {
        sendMessageRequest.sessionId = sessionId.value;
        const response = await sendMessageUsingPost(sendMessageRequest);

        if (response.code == 200) {
          // 添加 AI 回复到上下文
          messages.value.push({
            id: Date.now(),
            sender: "other",
            text: response.data,
            htmlContent: marked(response.data), // 使用 marked 解析为 HTML，支持代码高亮
            isMarkdown: true, // 标识为 Markdown
            time: new Date().toLocaleTimeString(),
            avatar: AIAvatar,
          });
          await fetchChatSessions(User.value?.user_id);

          // 高亮代码块
          const codeBlocks = document.querySelectorAll("pre code");
          codeBlocks.forEach((block) => {
            hljs.highlightElement(block);
          });
          // 滚动到底部
          await nextTick();
          scrollToBottom();
        } else {
          message.error("获取AI回复失败");
        }
      } catch (error) {
        message.error("获取AI回复失败");
        console.error("Error fetching ChatGPT response:", error);
      } finally {
        isLoading.value = false; // 加载结束
      }
    } else {
      message.error("会话创建失败，无法发送消息");
      isLoading.value = false; // 加载结束
    }
  }
};

// 滚动到聊天窗口底部的方法
const scrollToBottom = async () => {
  await nextTick(); // 确保 DOM 完全更新
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const loadChatSession = async (sessionIdParam) => {
  try {
    const response = await getChatMessagesUsingGet({
      sessionId: sessionIdParam,
    });

    if (response.code == 200) {
      messages.value = response.data?.map((message) => ({
        id: message.id,
        sender: message.role === "user" ? "me" : "other",
        text: message.content,
        htmlContent: marked(message.content), // 使用 marked 解析为 HTML
        isMarkdown: message.role !== "user",
        time: new Date(message.created_time).toLocaleString(),
        avatar: message.role === "user" ? User.value?.avatar : AIAvatar,
      }));

      const selectedContact = contacts.value.find(
        (contact) => contact.id === sessionIdParam
      );
      if (selectedContact) {
        currentContactName.value = selectedContact.name;
        currentContactLastActive.value = selectedContact.time;
        selectedModel.value = selectedContact.model; // 同步选中的模型
        sessionId.value = sessionIdParam; // 确保设置正确的 sessionId
      }
      scrollToBottom();
    } else {
      message.error("加载聊天记录失败");
    }
  } catch (error) {
    message.error("加载聊天记录失败");
    console.error("Error loading chat session:", error);
  }
};

// 重命名会话
const renameConversation = async (id: number) => {
  const newName = await new Promise((resolve) => {
    Modal.confirm({
      title: "重命名会话",
      content:
        "<a-input v-model:value='inputValue' placeholder='请输入新的会话名称' />",
      okText: "确定",
      cancelText: "取消",
    });
  });

  if (newName && newName.trim()) {
    try {
      const response = await renameChatSessionUsingPost({
        id,
        name: newName.trim(),
      });
      if (response.code === 200) {
        message.success("重命名成功");
        fetchChatSessions(User.value?.user_id); // 刷新列表
      } else {
        message.error("重命名失败");
      }
    } catch (error) {
      message.error("重命名出错");
    }
  }
};

// 删除会话
const deleteConversation = async (id: number) => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除该会话吗？删除后无法恢复。",
    okText: "确定",
    cancelText: "取消",
    onOk: async () => {
      try {
        const response = await deleteChatSessionUsingPost({ id });
        if (response.code === 200) {
          message.success("会话已删除");
          fetchChatSessions(User.value?.user_id); // 刷新列表
        } else {
          message.error("删除失败");
        }
      } catch (error) {
        message.error("删除出错");
      }
    },
  });
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  max-height: 90vh;
  border-radius: 15px;
}

.code-block {
  background-color: #f5f5f5;
  border: 1px solid #eaeaea;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
  overflow-x: auto;
}

.content {
  flex-grow: 1;
  padding: 10px;
  border-radius: 15px;
  min-width: 70%;
  margin: 0px auto;
  border: 1px solid honeydew;
}

.chat-interface {
  height: 84vh;
  font-family: Arial, sans-serif;
}

.contact-list {
  background-color: rgba(224, 224, 224, 0.22);
  color: #333;
  padding: 20px;
  border-right: 1px solid #eaeaea;
}

.new-conversation-button {
  margin-bottom: 20px;
}

.profile {
  text-align: center;
  margin-bottom: 20px;
}

.profile-image {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.search-bar {
  margin-bottom: 20px;
}

.contacts {
  overflow-y: auto;
  max-height: 60vh;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: #f0f0f0;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.contact-info {
  min-width: 140px;
  margin-left: 10px;
}

.contact-info h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.contact-info p {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.contact-time {
  margin-left: auto;
  font-size: 12px;
  color: #888;
}

.chat-window {
  background-color: #f9f9f9; /* 使用较浅的灰色，避免纯白造成强烈对比 */
  color: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 84vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); /* 添加轻微阴影，提升层次感 */
}

.chat-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.chat-header-info {
  margin-left: 10px;
}

.chat-header-info h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.chat-header-info span {
  font-size: 12px;
  color: #888;
}

.chat-messages {
  border: 1px rgba(0, 119, 255, 0.27) solid;
  flex: 1;
  overflow-y: auto; /* 添加垂直滚动条 */
  margin: 20px 0;
  padding: 20px; /* 给内容添加适当的内边距 */
  white-space: pre-wrap; /* 使消息文本支持自动换行 */
  background-color: rgba(225, 236, 240, 0.14); /* 消息区保持简洁的白色背景 */
  border-radius: 8px; /* 圆角，提升视觉柔和感 */
}

/* 自定义滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 10px; /* 滚动条的宽度 */
}

.chat-messages::-webkit-scrollbar-track {
  background: #f0f0f0; /* 滚动条轨道的背景色 */
  border-radius: 10px; /* 滚动条轨道的圆角 */
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d2e3f2; /* 滚动条的颜色 */
  border-radius: 10px; /* 滚动条的圆角 */
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #b4daf7; /* 滚动条在鼠标悬停时的颜色 */
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.avatar-left {
  margin-right: 10px;
}

.avatar-right {
  order: 2;
  margin-left: 10px;
}

.other-message,
.my-message {
  max-width: 60%;
  padding: 20px 20px 15px 20px;
  border-radius: 8px;
  color: #333;
  position: relative;
  white-space: pre-wrap; /* 支持自动换行 */
}

/* 修改发送者消息和接收者消息的样式 */
.other-message {
  border: 1px solid rgb(225, 225, 225); /* 较浅的边框 */
  background-color: rgba(219, 219, 219, 0.26); /* 柔和的灰色背景，避免突兀 */
  line-height: 1.5;
}

.my-message {
  background: #e9f5e2;
  border-radius: 8px;
  margin-left: auto;
}

.message-time {
  display: block;
  font-size: 12px;
  color: #999; /* 调整为较暗的灰色，降低视觉优先级 */
  margin-top: 15px;
  text-align: right;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #eaeaea;
  background-color: #f9f9f9; /* 区别于聊天消息区，保持统一 */
}

.input-box {
  flex: 1;
  margin-right: 10px;
}

.code-block {
  border-radius: 5px;
  white-space: pre-wrap;
  overflow-x: auto;
  background-color: #f5f5f5; /* 设置代码块背景颜色，使高亮更加明显 */
  box-sizing: border-box;
}

pre,
code {
  line-height: 1.5; /* 适当的行高，提升阅读体验 */
}

.contacts-container {
  max-height: 60vh; /* 设置最大高度 */
  overflow-y: auto; /* 当内容超出时启用滚动条 */
}

/* 自定义滚动条样式 */
.contacts-container::-webkit-scrollbar {
  width: 8px; /* 滚动条的宽度 */
}

.contacts-container::-webkit-scrollbar-track {
  background: #f0f0f0; /* 滚动条轨道的背景色 */
  border-radius: 10px;
}

.contacts-container::-webkit-scrollbar-thumb {
  background: #d2e3f2; /* 滚动条的颜色 */
  border-radius: 10px;
}

.contacts-container::-webkit-scrollbar-thumb:hover {
  background: #d0e6f5; /* 滚动条在鼠标悬停时的颜色 */
}

/* 平板设备媒体查询 (600px - 1024px) */
@media (max-width: 1920px) {
  .content {
    width: 98%;
    min-width: 200px;
  }
}
</style>
