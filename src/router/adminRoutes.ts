// src/router/adminRoutes.ts
import { RouteRecordRaw } from "vue-router";

const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/admin/AdminHome.vue"), // AdminHome.vue作为父组件
    meta: {
      breadcrumb: "管理后台",
    },
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/admin/dashboard/Dashboard.vue"), // Dashboard作为子组件
        meta: {
          breadcrumb: "仪表盘",
          icon: "HomeOutlined",
        },
      },
      {
        path: "webControl",
        name: "webControl",
        component: () => import("@/views/admin/web/WebView.vue"), // Dashboard作为子组件
        meta: {
          breadcrumb: "网站管理",
          icon: "ControlOutlined",
        },
      },
      {
        path: "userControl",
        name: "userControl",
        component: () => import("@/views/admin/user/user-crud-table.vue"),
        meta: {
          breadcrumb: "用户管理",
          icon: "UserOutlined",
        },
      },
      {
        path: "AIControl",
        name: "AIControl",
        component: () => import("@/views/admin/ai/ai-crud-table.vue"),
        meta: {
          breadcrumb: "AI管理",
          icon: "RobotOutlined",
        },
      },
      {
        path: "postControl",
        name: "postControl",
        component: () => import("@/views/admin/post/post-crud-table.vue"),
        meta: {
          breadcrumb: "文章管理",
          icon: "ReadOutlined",
        },
      },
      {
        path: "commentControl",
        name: "commentControl",
        component: () => import("@/views/admin/comment/comment-crud-table.vue"),
        meta: {
          breadcrumb: "评论管理",
          icon: "CommentOutlined",
        },
      },
      {
        path: "productControl",
        name: "productControl",
        component: () => import("@/views/admin/product/product-crud-table.vue"),
        meta: {
          breadcrumb: "教程管理",
          icon: "CodeOutlined",
        },
      },
      {
        path: "orderControl",
        name: "orderControl",
        component: () => import("@/views/admin/order/order-crud-table.vue"),
        meta: {
          breadcrumb: "订单管理",
          icon: "CreditCardOutlined",
        },
      },
    ],
  },
];

export default adminRoutes;
