import { createApp } from "vue";
// import "./style.css";
import App from "./App.vue";
import Antd, { message } from "ant-design-vue";
import router from "./router";
import "virtual:uno.css";
import "uno.css";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import { createPinia } from "pinia";
import Prism from "prismjs";

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

const app = createApp(App);
app.use(router);
app.use(Antd);
app.use(VueMarkdownEditor);
app.use(createPinia());

app.mount("#app");
