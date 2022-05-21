export const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/index.vue"),
    meta: {},
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {},
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/empty/index.vue"),
  },
];
