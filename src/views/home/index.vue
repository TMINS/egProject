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
const io = new socket({ ws: "http://192.168.8.183:3000" });
const load = () => {
  // routeStore.asyncLoadComponent("/test/index.vue");

  io.asyncConnect();
  io.subscribe({
    destination: "chat message",
    callback: (res) => {
      console.log("客户机收到消息：" + res);
    },
  });
};
const route = () => {
  // router.push({ path: "/test" });
  io.disconnect();
};
</script>

<style lang="scss" scoped></style>
