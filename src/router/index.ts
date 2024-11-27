// src/router/index.ts

import { createRouter, createWebHistory } from "vue-router";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/common/login/Login.vue"),
  },
  ...adminRoutes,
  ...userRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
