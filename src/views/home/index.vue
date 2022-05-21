<template>
  <div @click="load">home</div>
  <div @click="route">route</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useRouteStore } from "@/store/module/route";
import socket from "@/socket";

const routeStore = useRouteStore();
const router = useRouter();
const load = () => {
  // routeStore.asyncLoadComponent("/test/index.vue");
  const io = new socket("http://192.168.8.183:3000");
  console.log(io);
  io.send();
};
const route = () => {
  router.push({ path: "/test" });
};
</script>

<style lang="scss" scoped></style>
