# Cui Ziqian — Craft Table Portfolio

个人作品集的 Craft Table 版本。项目是无框架的静态网站，包含 Project、Visual、Video、Operation、Resume 与 Work in Progress 页面。

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm run dev -- 4174
```

浏览器打开：`http://127.0.0.1:4174/`

## 生产构建

```bash
npm run build
npm run preview -- 4174
```

构建产物生成在 `dist/`。

## 从 GitHub 部署到 Vercel

1. 将本目录中的全部文件上传或推送到一个 GitHub 仓库。
2. 在 Vercel 中选择 **Add New Project**，导入该仓库。
3. Vercel 会读取根目录的 `vercel.json`：
   - Build Command：`npm run build`
   - Output Directory：`dist`
4. 点击 Deploy。

页面使用 Hash 路由，因此刷新 Project、Visual 等模块时不需要额外的服务器重写规则。

## 主要入口

- 首页组件：`src/CraftTableHomeV3.js`
- 路由入口：`src/main.js`
- 静态资源：`public/`

## 注意

- 不要把本机绝对路径写入网页代码。
- `node_modules/` 和 `dist/` 不需要上传到 GitHub。
- 仓库包含视频资源，首次上传和首次部署可能需要较长时间。
