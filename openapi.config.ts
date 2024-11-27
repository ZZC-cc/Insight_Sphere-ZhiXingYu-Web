import { generateService } from "@umijs/openapi";
import fs from "fs";
import path from "path";

// 生成服务接口文件
generateService({
  schemaPath: "http://localhost:9666/api/v3/api-docs", // 可以是.json文件，也可以是远程json地址
  serversPath: "./src/servers",
}).then(() => {
  // 替换生成的代码中的特定文本
  replaceImports("./src/servers/api");
});

// 替换特定的 import 语句
function replaceImports(dirPath: any) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("读取文件夹出错:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (file.endsWith(".ts")) {
        // 读取每个文件并替换 import 语句
        fs.readFile(filePath, "utf8", (readErr, data) => {
          if (readErr) {
            console.error("读取文件出错:", readErr);
            return;
          }

          const modifiedData = data.replace(
            /import { request } from ['"]umi['"];/g,
            'import request from "../../utils/request.ts";'
          );

          // 写入修改后的内容
          fs.writeFile(filePath, modifiedData, "utf8", (writeErr) => {
            if (writeErr) {
              console.error("写入文件出错:", writeErr);
            } else {
              console.log(`已更新文件: ${filePath}`);
            }
          });
        });
      }
    });
  });
}
