declare module "@umijs/openapi";
declare const API: any;
// 在您的组件顶部添加
declare global {
  interface Window {
    initGeetest: any;
  }
}
declare let initGeetest;
