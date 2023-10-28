# Configuration and Deployment Description

# 配置

## vue.config.js

```js
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        querystring: require.resolve('querystring-es3')
      },
    },
  },
  devServer: {
    proxy: {
      '/otn': {
        target: 'https://kyfw.12306.cn',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});


```
## jsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "baseUrl": "./",
    "moduleResolution": "node",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  }
}


```


# 前端部署（Windows 本机）

## 准备前端环境
- 在 Windows 本机上安装以下软件：Node.js、npm 和 Nginx。

## 获取前端项目源代码
- 克隆前端源代码从项目的代码仓库中。使用以下命令：
git clone https://github.com/IkMangMok/mashup_app
进入 `vue-project` 文件夹或者直接使用文档中提供的代码获取前端代码。

## 安装前端依赖项
- 进入前端项目目录，并安装前端依赖项：
cd vue-project\vue_project
npm install


## 构建前端应用
- 使用以下命令构建前端应用：
npm run build

这将生成一个 `dist` 目录，包含已构建好的前端应用。

## 复制 `dist` 文件到 Nginx 服务器
- 将前端构建后的文件（位于 `dist` 目录中）部署到 Nginx 服务器中，并配置 Nginx 以将前端请求代理到后端。

## Nginx 部署
- 进入 Nginx 所在目录中的 `conf` 文件夹。
- 编辑 `nginx.conf` 文件，将服务器配置如下所示：
```nginx
server {
      listen       80;
      server_name  100.80.163.115; // 服务器的IP地址，此时选择本机的公网地址

      location / {
            root   html\dist; // 添加一个 `dist` 子路径
            index  index.html index.htm;
      }

      error_page   500 502 503 504  /50x.html;
      location = /50x.html {
            root   html\dist;
      }
   }
```

## 上线使用

在 Nginx 所在目录下运行以下命令启动 Nginx 服务：
```bash
./nginx
```
现在，您可以通过以下网址访问项目前端界面：
http://100.79.121.104

