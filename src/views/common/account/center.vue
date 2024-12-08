<script setup lang="ts">
import {
  ApartmentOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { nextTick, reactive, ref } from "vue";
import rightContent from "./components/right-content.vue";
import { useUserStore } from "@/stores/user.ts";

const inputRef = ref();
const state = reactive({
  tags: ["专注", "坚持", "很有想法", "执行力强", "乐观"],
  inputVisible: false,
  inputValue: "",
});

const { userVO } = useUserStore();
console.log("userVO", userVO);

function handleClose(removedTag: string) {
  const tags = state.tags.filter((tag) => tag !== removedTag);
  state.tags = tags;
}

function showInput() {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
}

function handleInputConfirm() {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && !tags.includes(inputValue)) tags = [...tags, inputValue];

  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: "",
  });
}
</script>

<template>
  <div class="gutter-example">
    <a-row :gutter="24">
      <a-col :span="7">
        <a-card>
          <div class="flex justify-center">
            <a-avatar :size="86">
              <template #icon>
                <img :src="userVO?.avatar" alt="" />
              </template>
            </a-avatar>
          </div>
          <div class="flex flex-col items-center justify-center mt-5">
            <span class="font-bold text-16px"
              >{{ userVO?.name }}
              <span v-if="userVO?.role === 'admin'">
                <a-tag color="red" style="border-radius: 0; margin-left: 5px"
                  >管理员</a-tag
                >
              </span>
              <span v-if="userVO?.role === 'user'">
                <a-tag color="blue" style="border-radius: 0; margin-left: 5px"
                  >用户</a-tag
                >
              </span>
              <span v-if="userVO?.role === 'vip'">
                <a-tag color="orange" style="border-radius: 0; margin-left: 5px"
                  >VIP</a-tag
                >
              </span>
            </span>
            <span style="color: rgb(174, 174, 174)" mt2>
              <span v-if="userVO?.description?.length > 0">{{
                userVO?.description
              }}</span>
              <span v-else>这个人很懒，什么都没有留下</span>
            </span>
          </div>
          <div class="p-8">
            <p>
              <span class="mr-2">
                <PhoneOutlined />
              </span>
              <span>{{ userVO?.mobile }}</span>
            </p>
            <p>
              <span class="mr-2">
                <MailOutlined />
              </span>
              <span>{{ userVO?.email }}</span>
            </p>
            <p>
              <span class="mr-2">
                <ApartmentOutlined />
              </span>
              <span>
                {{ userVO?.description }}
              </span>
            </p>
            <p>
              <span class="mr-2">
                <HomeOutlined />
              </span>
              <span>
                {{ userVO?.address }}
              </span>
            </p>
          </div>
          <div mb-16>
            <p>我的标签</p>
            <template v-for="(tag, index) in state.tags" :key="tag">
              <a-tooltip v-if="tag.length > 20" :title="tag">
                <a-tag :closable="index !== 0" @close="handleClose(tag)">
                  {{ `${tag.slice(0, 20)}...` }}
                </a-tag>
              </a-tooltip>
              <a-tag v-else :closable="index !== 0" @close="handleClose(tag)">
                {{ tag }}
              </a-tag>
            </template>
            <a-input
              v-if="state.inputVisible"
              ref="inputRef"
              v-model:value="state.inputValue"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              @blur="handleInputConfirm"
              @keyup.enter="handleInputConfirm"
            />
            <a-tag
              v-else
              style="background: #fff; border-style: dashed"
              @click="showInput"
            >
              <PlusOutlined />
            </a-tag>
          </div>
          <!--          <div class="mt-10"> -->
          <!--            <p> -->
          <!--              {{ t('account.cneter.team') }} -->
          <!--            </p> -->
          <!--            <div class="flex flex-wrap justify-between"> -->
          <!--              <span v-for="(item, index) in teamData" :key="index" class="flex items-center w-120px mb-5"> -->
          <!--                <a-avatar :size="26" class="mr-2"> -->
          <!--                  <template #icon> -->
          <!--                    <img :src="item.link" alt=""> -->
          <!--                  </template> -->
          <!--                </a-avatar> -->
          <!--                <span>{{ item.name }}</span> -->
          <!--              </span> -->
          <!--            </div> -->
          <!--          </div> -->
        </a-card>
      </a-col>
      <!-- right-content -->
      <a-col :span="17">
        <right-content />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
.gutter-example {
  width: 99%;
}
</style>
