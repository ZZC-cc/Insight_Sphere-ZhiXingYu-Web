import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import typescript from "highlight.js/lib/languages/typescript";

// 注册所需的语言
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("typescript", typescript);

// 示例代码：用于高亮一个代码块
import { onMounted, ref } from "vue";

const codeBlock = (ref < HTMLDivElement) | (null > null);

onMounted(() => {
  if (codeBlock.value) {
    hljs.highlightBlock(codeBlock.value);
  }
});
