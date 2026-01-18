# 为 TikZ 渲染提供后端服务

## 项目简介

通过部署本项目到 Vercel 可以为 TikZ 渲染提供后端服务，本项目依赖 [node-tikzjax](https://github.com/prinsss/node-tikzjax) 包实现 TikZ 代码的渲染，如果你只想自己使用即禁止跨域，可以卸载 `cors` 包，并移除相关代码。

## 在 Vercel 部署 express服务

将本仓库一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Einstein-schrodinger/tikz-express&project-name=tikz-express&repository-name=tikz-express)

## 本地运行测试

部署前，你也可以自己在本地进行测试修改

1. 克隆仓库到本地

```bash
git clone https://github.com/Einstein-schrodinger/tikz-express
```
2. 安装 Vercel CLI:

```bash
pnpm i -g vercel
```
3. 安装依赖

```bash
pnpm i
```
4. 在仓库的根目录下运行:

```bash
vercel dev
```
