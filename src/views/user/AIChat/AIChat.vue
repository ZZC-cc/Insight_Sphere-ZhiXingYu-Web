<template>
  <!-- 主内容区域 -->
  <div class="content">
    <a-modal
      v-model:visible="renameModalVisible"
      title="重命名会话"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleRenameOk"
      @cancel="handleRenameCancel"
    >
      <a-input
        v-model:value="renameInputValue"
        placeholder="请输入新的会话名称"
        allow-clear
      />
    </a-modal>
    <a-flex class="chat-interface">
      <!-- 左侧联系人列表和新建会话按钮 -->
      <div width="20%" class="contact-list">
        <div class="profile">
          <a-avatar-group>
            <a-avatar
              v-for="platform in platforms"
              :key="platform.id"
              :src="platform.platform_image_url"
              :alt="platform.platform_name"
              class="profile-avatar"
            />
          </a-avatar-group>
          <h3>多平台 AI 聚合对接</h3>
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
          <a-flex
            style="width: 100%"
            v-for="contact in contacts"
            :key="contact.id"
            class="contact-item"
            :class="{ active: contact.id === sessionId }"
          >
            <div style="width: 13%" @click="loadChatSession(contact.id)">
              <img :src="contact.avatar" alt="avatar" class="contact-avatar" />
            </div>
            <div
              style="width: 63%"
              class="contact-info"
              @click="loadChatSession(contact.id)"
            >
              <h4>{{ contact.name }}</h4>
              <p style="margin-top: 5px">{{ contact.lastMessage }}</p>
            </div>
            <div
              style="width: 17%"
              class="contact-time"
              @click="loadChatSession(contact.id)"
            >
              <a-row>{{ contact.time.split(" ")[0] }}</a-row>
              <a-row>{{ contact.time.split(" ")[1].slice(0, 8) }}</a-row>
            </div>
            <div style="width: 1%">
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="showRenameModal(contact.id)">
                      <span><EditOutlined mr3 />重命名</span>
                    </a-menu-item>
                    <a-menu-item danger @click="deleteConversation(contact.id)">
                      <span><DeleteOutlined mr3 />删除</span>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button type="link"> ⋮</a-button>
              </a-dropdown>
            </div>
          </a-flex>
        </div>
      </div>
      <!-- 右侧聊天窗口 -->
      <div width="90%" class="chat-window">
        <div class="chat-header">
          <a-avatar
            :src="currentAIAvatar"
            alt="AI Avatar"
            style="width: 60px; height: 60px"
          />
          <div ml3 mb1>
            <h3 style="margin: 5px 0px 8px 0px">
              {{ currentContactName
              }}<span ml3
                ><EditOutlined
                  mr3
                  @click="showRenameModal(route.query.sessionId)"
              /></span>
            </h3>
            <div mt1>最后一次活动: {{ currentContactLastActive }}</div>
          </div>
        </div>

        <!-- 聊天消息列表 -->
        <div ref="messageContainer" class="chat-messages">
          <div
            v-if="messages.length > 0"
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
          <div v-if="messages.length === 0" class="no-messages">
            <div v-if="messages.length === 0" class="no-messages">
              <div class="welcome-container">
                <h3>你好👋！欢迎使用知行域 AI 聊天助手！</h3>
                <p>你可以问我这些问题，点击即可快速添加到输入框：</p>
                <div class="suggestion-buttons">
                  <a-button
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    type="default"
                    @click="addToInput(suggestion)"
                    class="suggestion-button"
                  >
                    {{ suggestion }}
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          <a-skeleton
            v-if="isLoading"
            avatar
            :paragraph="{ rows: 4 }"
            style="width: 80%"
          />
        </div>

        <div class="chat-input">
          <a-row>
            <a-button
              type="link"
              style="font-size: 20px; margin-top: -5px; color: #1878ff"
              ml3
            >
              <BulbOutlined />
            </a-button>
            <a-button
              type="link"
              style="font-size: 20px; margin-top: -5px; color: #1878ff"
            >
              <ClearOutlined />
            </a-button>
            <a-button
              type="link"
              style="font-size: 20px; margin-top: -5px; color: #1878ff"
            >
              <PictureOutlined />
            </a-button>
            <a-button
              type="link"
              style="font-size: 20px; margin-top: -5px; color: #1878ff"
            >
              <FileAddOutlined />
            </a-button>

            <a-select
              v-model:value="selectedPlatform"
              placeholder="选择AI"
              style="width: 150px; margin-right: 10px"
            >
              <a-select-option
                v-for="platform in platforms"
                :key="platform.id"
                :value="platform.id"
              >
                <a-tooltip placement="left">
                  <template #title>
                    <span>{{ platform.platform_description }}</span>
                  </template>
                  <a-row>
                    <img
                      :src="platform.platform_image_url"
                      width="28px"
                      height="28px"
                      mr2
                    />
                    <div style="font-weight: 550">
                      {{ platform.platform_name }}
                    </div>
                  </a-row>
                </a-tooltip>
              </a-select-option>
            </a-select>

            <a-select
              v-model:value="selectedModel"
              placeholder="选择模型"
              style="width: 250px"
              :disabled="!selectedPlatform"
            >
              <a-select-option
                v-for="model in models"
                :key="model.id"
                :value="model.model_name"
              >
                <a-tooltip placement="left">
                  <template #title>
                    <span>{{ model.model_desc }}</span>
                  </template>
                  {{ model.model_name }}
                  <a-tag ml2 color="blue" v-if="model.rate == 0">免费</a-tag>
                </a-tooltip>
              </a-select-option>
            </a-select>

            <a-button
              ml3
              mr4
              style="position: fixed; right: 50px"
              type="primary"
              @click="sendMessage"
              :disabled="isLoading"
            >
              <SendOutlined style="transform: rotate(-45deg)" />
              发送
            </a-button>
          </a-row>

          <a-row>
            <a-textarea
              mt2
              v-model:value="newMessage"
              placeholder="在这里输入你的问题.."
              class="input-box"
              @keyup.enter="sendMessage"
              :auto-size="{ minRows: 6, maxRows: 8 }"
            />
          </a-row>
        </div>
      </div>
    </a-flex>
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
  ClearOutlined,
  BulbOutlined,
  PictureOutlined,
  FileAddOutlined,
  InfoCircleOutlined,
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

const suggestions = [
  "❓ 你是什么大语言模型？",
  "📚 推荐一些适合初学者的编程书籍。",
  "🐍 用 Python 写一个简单的计时器。",
  "🤖 最近的人工智能领域有哪些进展？",
];

const addToInput = (text) => {
  newMessage.value = text; // 将提示词填入输入框
};

const AIAvatar =
  "https://zcc-1305301692.cos.ap-guangzhou.myqcloud.com/cclogo.png";

const currentAIAvatar = computed(() => {
  const platform = platforms.value.find(
    (item) => item.id === selectedPlatform.value
  );
  return platform?.platform_image_url || AIAvatar; // 默认使用原始 AIAvatar
});

// 联系人列表数据
const contacts = ref([]);

// 聊天消息数据
const messages = ref([]);

watch(messages, async () => {
  await nextTick();
  highlightCodeBlocks();
});

// 当前输入的新消息
const newMessage = ref("");
const selectedModel = ref("GLM-4-Plus"); // 选中的模型
const currentContactName = ref("新会话");
const currentContactLastActive = ref("刚刚");

// 参考消息容器的 ref
const messageContainer = ref(null);
const sessionId = ref(null); // 存储会话ID

import { useUserStore } from "@/stores/user";
import UserVO = API.UserVO;
import {
  createSessionUsingPost,
  deleteSessionUsingDelete,
  getUserSessionsUsingPost,
  updateSessionNameUsingPost,
  updateSessionUsingPut,
} from "@/servers/api/aiChatSessionController.ts";
import CreateSessionRequest = API.CreateSessionRequest;
import SendMessageRequest = API.SendMessageRequest;
import {
  getMessagesUsingPost,
  sendMessageUsingPost,
} from "@/servers/api/aiChatMessageController.ts";
import {
  getPlatformByIdUsingGet,
  listPlatformsUsingGet,
} from "@/servers/api/aiPlatformController.ts";
import {
  getPlatformIdByModelNameUsingGet,
  listModelsByPlatformIdUsingGet,
  listModelsUsingGet,
} from "@/servers/api/aiModelController.ts";
import AIPlatform = API.AIPlatform;

const userStore = useUserStore();
const User = computed(() => userStore.userVO<UserVO>);
const platforms = ref(<AIPlatform>[]); // 存储平台数据
const platformId = ref(null);
const models = ref([]); // 存储对应模型数据
const selectedPlatform = ref(null); // 存储选中的平台 ID

// 获取平台数据
const fetchPlatforms = async () => {
  try {
    const res = await listPlatformsUsingGet();
    if (res.code === 200) {
      platforms.value = res.data;
    } else {
      message.error("获取平台数据失败");
    }
  } catch (error) {
    console.error("Error fetching platforms:", error);
    message.error("获取平台数据失败");
  }
};

// 根据平台 ID 获取模型数据
const fetchModelsByPlatform = async (platformId) => {
  try {
    const res = await listModelsByPlatformIdUsingGet({
      platformId: platformId,
    });
    if (res.code === 200) {
      models.value = res.data;
    } else {
      message.error("获取模型数据失败");
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    message.error("获取模型数据失败");
  }
};

// 监听平台选择变化，动态加载模型数据
watch(selectedPlatform, async (newPlatformId) => {
  platformId.value = newPlatformId;
  if (newPlatformId) {
    await fetchModelsByPlatform(newPlatformId);
    selectedModel.value = models.value[0]?.model_name;
  }
});

const platformImageUrl = async (modelName: string) => {
  const platforms = await getPlatformIdByModelNameUsingGet({
    modelName: modelName,
  });
  const ref = await getPlatformByIdUsingGet({ id: platforms.data });
  const platform_image_url = ref.data?.platform_image_url;
  console.log(platform_image_url);
  return platform_image_url;
};
// 获取历史会话列表
const fetchChatSessions = async (userId: any) => {
  try {
    const sessionRes = await getUserSessionsUsingPost();

    if (sessionRes.code == 200) {
      const contactsData = await Promise.all(
        sessionRes.data.map(async (session) => {
          const platformIdRes = await getPlatformIdByModelNameUsingGet({
            modelName: session.model,
          });
          const platformRes = await getPlatformByIdUsingGet({
            id: platformIdRes.data,
          });

          return {
            id: session.id,
            name: session.session_name || "未命名会话",
            lastMessage: session.summary,
            time: new Date(session.created_time).toLocaleString(),
            avatar: platformRes.data?.platform_image_url || AIAvatar, // 解析后的图片 URL
            model: session.model,
          };
        })
      );

      contacts.value = contactsData; // 更新 contacts 数据
    } else {
      message.error("获取会话列表失败");
    }
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    message.error("获取会话列表失败");
  }
};
const sessionIdFromUrl = ref("");

onMounted(async () => {
  sessionIdFromUrl.value = route.query.sessionId;
  await nextTick();

  if (sessionIdFromUrl.value) {
    sessionId.value = sessionIdFromUrl.value; // 同步 URL 中的 sessionId 到状态
    await loadChatSession(sessionIdFromUrl.value); // 加载会话数据
  } else {
    sessionId.value = null;
    messages.value = []; // 清空聊天内容
    contacts.value = []; // 清空会话列表
  }
  await fetchChatSessions(User.value?.user_id);
  await fetchPlatforms();
  const res = await getPlatformIdByModelNameUsingGet({
    modelName: selectedModel.value,
  });
  platformId.value = res.data;
  selectedPlatform.value = platformId.value;

  const newSessionId = route.query.sessionId;
  if (newSessionId) {
    sessionId.value = newSessionId; // 更新 sessionId
    await loadChatSession(newSessionId); // 加载会话数据
  }
  await nextTick();
});

// 监听 selectedModel 的变化，当模型变化时更新 createChat.model
watch(selectedModel, async (newModel) => {
  selectedModel.value = newModel;
  createChat.model = newModel;
  const res = await getPlatformIdByModelNameUsingGet({ modelName: newModel });
  platformId.value = res.data;
  selectedPlatform.value = platformId.value;
});

const createChat = reactive<CreateSessionRequest>({
  userId: User.value?.user_id,
  model: selectedModel.value,
});

const sendMessageRequest = reactive<SendMessageRequest>({
  sessionId: sessionId.value,
  role: "user",
  platformId: selectedPlatform.value,
  content: newMessage.value,
  model: selectedModel.value,
});

// 新建会话
const newConversation = async () => {
  try {
    createChat.model = selectedModel.value; // 使用当前选中的模型
    createChat.userId = User.value?.user_id; // 确保用户 ID 也正确
    const res = await createSessionUsingPost(createChat);

    if (res.code === 200) {
      sessionId.value = res.data;
      messages.value = []; // 清空当前消息，开始新会话
      currentContactName.value = "新会话";
      currentContactLastActive.value = "1 分钟前";

      // 更新选中平台图像
      const platformRes = await getPlatformIdByModelNameUsingGet({
        modelName: selectedModel.value,
      });
      if (platformRes.code === 200) {
        selectedPlatform.value = platformRes.data;
      }

      message.success("新会话已创建");
    } else {
      message.error("创建会话失败");
    }
  } catch (error) {
    console.error("Error creating new conversation:", error);
    message.error("创建会话失败");
  }
};

// 更新会话的模型
const updateConversationModel = async (
  sessionId: any,
  model: string,
  platform: any
) => {
  sendMessageRequest.model = model;
  sendMessageRequest.platformId = platform;
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
      // 动态获取对应模型的图像
      const platformRes = await getPlatformByIdUsingGet({
        id: selectedPlatform.value,
      });
      const currentAIAvatar = platformRes.data?.platform_image_url || AIAvatar;

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

      // 等待后端的 AI 回复
      try {
        sendMessageRequest.sessionId = sessionId.value;
        sendMessageRequest.platformId = selectedPlatform.value;
        sendMessageRequest.model = selectedModel.value;

        const response = await sendMessageUsingPost(sendMessageRequest);
        await updateSessionUsingPut({
          id: sessionId.value,
          model: selectedModel.value,
        });

        if (response.code == 200) {
          // 添加 AI 回复到上下文，使用动态图像
          messages.value.push({
            id: Date.now(),
            sender: "other",
            text: response.data,
            htmlContent: marked(response.data), // 使用 marked 解析为 HTML
            isMarkdown: true, // 标识为 Markdown
            time: new Date().toLocaleTimeString(),
            avatar: currentAIAvatar,
          });
          // **手动触发代码块高亮**
          await nextTick();
          highlightCodeBlocks();
          await fetchChatSessions(User.value?.user_id); // 更新会话列表
          scrollToBottom();
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
      } finally {
        isLoading.value = false; // 加载结束
      }
    } else {
      message.error("会话创建失败，无法发送消息");
      isLoading.value = false; // 加载结束
    }
  }
};
const highlightCodeBlocks = () => {
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });
};

// 滚动到聊天窗口底部的方法
const scrollToBottom = async () => {
  await nextTick(); // 确保 DOM 完全更新
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 加载会话时，将会话 ID 更新到 URL
const loadChatSession = async (sessionIdParam) => {
  try {
    // 更新 URL 的 query 参数
    await router.push({ query: { sessionId: sessionIdParam } });

    // 你的现有加载逻辑...
    const response = await getMessagesUsingPost({
      sessionId: sessionIdParam,
      limit: 100,
    });

    if (response.code === 200) {
      const selectedContact = contacts.value.find(
        (contact) => contact.id === sessionIdParam
      );
      if (selectedContact) {
        currentContactName.value = selectedContact.name;
        currentContactLastActive.value = selectedContact.time;
        selectedModel.value = selectedContact.model;
        sessionId.value = sessionIdParam;

        // 更新消息
        messages.value = response.data?.map((message) => ({
          id: message.id,
          sender: message.role === "user" ? "me" : "other",
          text: message.content,
          htmlContent: marked(message.content),
          isMarkdown: message.role !== "user",
          time: new Date(message.created_time).toLocaleString(),
          avatar:
            message.role === "user" ? User.value?.avatar : currentAIAvatar,
        }));

        // 滚动到底部
        scrollToBottom();
      }
    } else {
      message.error("加载聊天记录失败");
    }
  } catch (error) {
    console.error("Error loading chat session:", error);
    message.error("加载聊天记录失败");
  }
};

// 控制 Modal 的显示与隐藏
const renameModalVisible = ref(false);
// 输入框的值
const renameInputValue = ref("");
// 当前重命名的会话 ID
const currentRenameId = ref(null);

// 显示重命名 Modal
const showRenameModal = (id) => {
  currentRenameId.value = id;
  renameInputValue.value = ""; // 清空输入框
  renameModalVisible.value = true; // 打开 Modal
};

// 确定按钮点击事件
const handleRenameOk = async () => {
  if (!renameInputValue.value.trim()) {
    message.error("会话名称不能为空！");
    return;
  }
  console.log("sessionIdFromUrl:" + sessionIdFromUrl.value);
  try {
    const response = await updateSessionNameUsingPost({
      id: currentRenameId.value,
      session_name: renameInputValue.value.trim(),
    });

    if (response.code === 200) {
      message.success("会话名称更新成功！");
      renameModalVisible.value = false; // 关闭 Modal
      await fetchChatSessions(User.value?.user_id); // 刷新会话列表
      currentContactName.value = renameInputValue.value.trim();
    } else {
      message.error("更新会话名称失败！");
    }
  } catch (error) {
    console.error("Error updating conversation name:", error);
    message.error("更新会话名称出错！");
  }
};

// 取消按钮点击事件
const handleRenameCancel = () => {
  renameModalVisible.value = false; // 关闭 Modal
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
        const response = await deleteSessionUsingDelete({ id: id });
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

const currentModel = computed(() => {
  return userStore.selectedModel;
});
</script>

<style scoped>
.page-container {
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
  margin: 0px auto;
  border: 1px solid honeydew;
}

.chat-interface {
  height: 84vh;
  font-family: Arial, sans-serif;
}

.contact-list {
  width: 35vh;
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

.contact-item.active {
  background-color: #effaff; /* 高亮背景色 */
  border-left: 4px solid #1890ff; /* 高亮边框 */
}

.contact-item.active:hover {
  background-color: #c5eafe; /* 鼠标悬浮时的高亮背景 */
}

.contacts {
  overflow-y: auto;
  max-height: 60vh;
}

.contact-item {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: #f0f0f0;
}

.contact-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
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
  font-size: 12px;
  color: #888;
}

.chat-window {
  background-color: #f9f9f9; /* 使用较浅的灰色，避免纯白造成强烈对比 */
  color: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 81vh;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); /* 添加轻微阴影，提升层次感 */
}

.chat-header {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
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
  max-width: 60vh;
}

.my-message {
  background: #e9f5e2;
  border-radius: 8px;
  margin-left: auto;
  max-width: 60vh;
}

.message-time {
  display: block;
  font-size: 12px;
  color: #999; /* 调整为较暗的灰色，降低视觉优先级 */
  margin-top: 15px;
  text-align: right;
}

.chat-input {
  align-items: center;
  padding: 10px 0;
  border: 1px solid #afafaf;
  border-radius: 5px;
  background-color: #ffffff; /* 区别于聊天消息区，保持统一 */
}

.input-box {
  font-size: 16px;
  flex: 1;
  border: none;
  margin-bottom: -10px;
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

.profile-avatar {
  //margin-right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.a-avatar-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
}

.welcome-container {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  margin: 20px;
}

.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.suggestion-button {
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 25px;
}

/* 平板设备媒体查询 (600px - 1024px) */
@media (max-width: 1720px) {
  .chat-window {
    min-width: 50%;
    max-width: 100%;
  }

  .contact-list {
    max-width: 35vh;
  }
}

@media (max-width: 1520px) {
  .content {
    width: 98%;
  }

  .chat-window {
    width: 63%;
  }

  .contact-list {
    max-width: 32vh;
  }
}

@media (max-width: 1060px) {
  .chat-window {
    width: 96%;
  }

  .contact-list {
    display: none;
  }
}
</style>
