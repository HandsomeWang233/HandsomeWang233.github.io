# Hexo + Stellar 博客

本站使用 Hexo 8、[Stellar 官方主题](https://github.com/xaoxuu/hexo-theme-stellar)和 GitHub Actions 部署到 GitHub Pages。主题以 Git submodule 固定到官方 `main` 的特定提交；不会在构建时自动升级。

## 本地预览

需要 Node.js 22+、Git 与 npm。在项目根目录运行：

```bash
npm ci
npm ci --prefix themes/stellar --omit=dev
npm run doctor
npm run build
npm run server
```

本地预览通常位于 <http://localhost:4000/>。文章放在 `source/_posts/`，站点标题、作者、网址在 `_config.yml` 修改；Stellar 配置在 `_config.stellar.yml`。不要直接编辑 `themes/stellar` 子模块中的文件。

## 发布到 GitHub Pages

本站仓库：<https://github.com/HandsomeWang233/HandsomeWang233.github.io>；发布网址：<https://handsomewang233.github.io/>。

GitHub Actions 在每次推送到 `main` 时自动安装依赖、构建站点并发布到 Pages。工作流会根据 GitHub 仓库名自动设置站点 URL；本地 `_config.yml` 也已配置为上述用户 Pages 网址。

在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中保持选择 **GitHub Actions**。首次发布后可在仓库 **Actions** 中查看 `Deploy Hexo to GitHub Pages` 的构建记录。如果需要手动重跑，在 Actions 选择该工作流的 **Run workflow**。

后续修改文章后，提交并推送到 `main` 即可重新发布：

```bash
git add .
git commit -m "Update blog"
git push
```

## 更新主题

```bash
git submodule update --remote themes/stellar
npm ci --prefix themes/stellar --omit=dev
npm run doctor
npm run build
```

检查更新后再提交子模块指针。主题当前为 Stellar v2 预发布源码；更新前建议阅读其 [CHANGELOG](https://github.com/xaoxuu/hexo-theme-stellar/blob/main/CHANGELOG.md)。
