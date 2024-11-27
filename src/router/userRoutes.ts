// src/router/userRoutes.ts

import { RouteRecordRaw } from "vue-router";
import Home from "../views/user/Home.vue";

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "/",
        component: () => import("@/views/user/Index/index.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/AIChat",
        component: () => import("@/views/user/AIChat/AIChat.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/post",
        component: () => import("@/views/user/Post/Post.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/post/:id",
        name: "PostDetail",
        component: () => import("@/views/user/Post/PostDetail.vue"),
        props: true,
        meta: { requiresAuth: false },
      },
      {
        path: "/product",
        component: () => import("@/views/user/Product/Product.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/product/:id",
        name: "ProductDetail",
        component: () => import("@/views/user/Product/ProductDetail.vue"),
        props: true,
        meta: { requiresAuth: false },
      },
      {
        path: "/information",
        component: () => import("@/views/user/Information/Information.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/order",
        component: () => import("@/views/user/Order/Order.vue"),
        meta: { requiresAuth: false },
      },
      {
        path: "/success/:orderId",
        component: () => import("@/views/user/common/Success.vue"),
        meta: { requiresAuth: false },
      },
    ],
  },
];

export default userRoutes;
