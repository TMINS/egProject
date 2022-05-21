import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { plugins } from './store/plugins'
// router
import router from "./router/index";
import "./router/guard.ts";

const APP = createApp(App);

const pinia = createPinia()
pinia.use(plugins)
APP.use(pinia);
APP.use(router);
APP.mount("#app");
