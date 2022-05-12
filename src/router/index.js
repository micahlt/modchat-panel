import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
  {
    path: "/",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/home",
    redirect: "/",
  },
  {
    path: "/404",
    component: () => import("../pages/404.vue"),
  },
  {
    path: "/quick",
    component: () => import("../pages/Quick.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
