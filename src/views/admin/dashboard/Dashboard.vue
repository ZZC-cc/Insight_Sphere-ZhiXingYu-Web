<template>
  <div style="width: 100%; height: 120px; background: #fff">
    <a-flex align="middle" style="height: 100%">
      <div style="padding: 10px" ml10>
        <a-avatar :src="User.avatar" alt="" :size="90" />
      </div>
      <div ml3 mt5.5>
        <div style="font-size: 18px">欢迎回来，{{ User.name }}</div>
        <div mt3 color-blueGray>{{ User.description }}</div>
      </div>

      <div style="position: absolute; right: 450px">
        <div color-blueGray text-16px mt5>用户数</div>
        <div text-26px mt3>{{ HomeVO.userCount }}</div>
      </div>
      <div style="position: absolute; right: 350px">
        <div color-blueGray text-16px mt5>文章数</div>
        <div text-26px mt3>{{ HomeVO.postCount }}</div>
      </div>
      <div style="position: absolute; right: 250px">
        <div color-blueGray text-16px mt5>商品数</div>
        <div text-26px mt3>{{ HomeVO.productCount }}</div>
      </div>
      <div style="position: absolute; right: 150px">
        <div color-blueGray text-16px mt5>订单数</div>
        <div text-26px mt3>{{ HomeVO.orderCount }}</div>
      </div>
      <div style="position: absolute; right: 50px">
        <div color-blueGray text-16px mt5>评论数</div>
        <div text-26px mt3>{{ HomeVO.commentCount }}</div>
      </div>
    </a-flex>
  </div>

  <div mt5 ml5>
    <a-flex>
      <div style="width: 68%" mr5>
        <a-card title="热门文章" :bordered="false">
          <a-card-grid
            style="width: 50%"
            v-for="(item, index) in HomeVO.postList"
          >
            <div fw550>{{ item.title }}</div>
            <div mt2 color-bluegray>
              {{
                item.content.length > 40
                  ? item.content.slice(0, 40) + "..."
                  : item.content
              }}
            </div>

            <div mt2>
              <a-tag v-for="tag in item.tagList" :key="tag" color="blue"
                >{{ tag }}
              </a-tag>
            </div>
            <div mt2>
              <a-avatar size="small" :src="item.user.avatar" />
              <span ml2 fw550>{{ item.user.name }}</span>
              <span ml2 color-bluegray>
                {{ item.createTime }}
              </span>
            </div>
            <div mt2>
              <span color-bluegray>浏览量 : {{ item.viewsNum }}</span>
              <span color-bluegray ml5>点赞量 : {{ item.thumbNum }}</span>
              <span color-bluegray ml5>收藏量 : {{ item.favourNum }}</span>
            </div>
          </a-card-grid>
        </a-card>
        <a-card title="热销商品" :bordered="false" mt5>
          <a-card-grid
            style="width: 50%"
            v-for="(item, index) in HomeVO.productList"
          >
            <a-flex>
              <div style="width: 40%">
                <img :src="item.images" style="width: 100%" />
              </div>
              <div style="width: 58%" ml5>
                <div fw550>{{ item.title }}</div>
                <div mt2 color-bluegray>
                  {{ item.description.slice(0, 40) }}...
                </div>

                <div mt2>
                  <a-tag v-for="tag in item.tags" :key="tag" color="orange"
                    >{{ tag }}
                  </a-tag>
                </div>
                <div mt2>
                  <span fw550 color-orange-6>￥{{ item.price }}</span>
                  <span ml5 color-bluegray>库存 : {{ item.stock }}</span>
                  <span ml5 color-bluegray>销量 : {{ item.buyNum }}</span>
                </div>
              </div>
            </a-flex>
          </a-card-grid>
        </a-card>
      </div>
      <div style="width: 30%">
        <a-card title="已接入AI" :bordered="false">
          <div v-for="item in HomeVO.aitop10" :key="item.id" mt2>
            <a-tooltip placement="right">
              <a-avatar size="120" :src="item.platform_image_url" ml1 />
              <span ml3 fw550>{{ item.platform_name }}</span>
              <template #title>
                <div>{{ item.platform_description }}</div>
              </template>
            </a-tooltip>
            <a ml5 fw550 @click="openUrl(item.platform_url)">{{
              item.platform_url
            }}</a>
          </div>
        </a-card>
        <a-card title="最新评论" mt5 :bordered="false">
          <div v-for="item in HomeVO.commentList" :key="item.id">
            <div color-bluegray mr1 mt--1>> {{ item.post_name }}</div>
            <div mt1>
              {{ item.content }}
            </div>
            <div mt2 mb--2>
              <a-avatar size="small" :src="item.user.avatar" />
              <span ml2 fw550>{{ item.user.name }}</span>
              <span ml2 color-bluegray>
                {{ item.createTime }}
              </span>
            </div>
            <a-divider
              v-if="
                item.id !== HomeVO.commentList[HomeVO.commentList.length - 1].id
              "
            />
          </div>
        </a-card>
      </div>
    </a-flex>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";
import { getHomeUsingGet } from "@/servers/api/homeController.ts";
import HomeVO = API.HomeVO;

const userStore = useUserStore();
const User = computed(() => userStore.userVO || {});
const HomeVO = ref(<HomeVO>{});

async function getHomeVO() {
  const res = await getHomeUsingGet();
  HomeVO.value = res.data;
  console.log(HomeVO);
}

function openUrl(url: string) {
  window.open(url);
}

getHomeVO();
</script>

<style scoped></style>
