# AIGC JSON 表单生成器

一个用于配置 AIGC 图像/视频生成参数并输出结构化 JSON 的可视化工具。

## 功能

- **文生图 (Text-to-Image)** — 配置画面比例、镜头、焦距、光圈、灯光、调色、质感、风格标签、负面提示等参数
- **图生视频 (Image-to-Video)** — 配置运动、运动曲线、景深、胶片颗粒、视差强度等参数，支持从文生图一键导入共享字段
- **描述性提示词** — 统一管理最终提示词、镜头、灯光、色调、质感、氛围等
- **JSON 实时预览** — 侧边栏实时查看生成的 JSON，一键复制到剪贴板
- **历史记录** — 自动记录每次复制，支持手动保存备忘录、批量管理、一键加载还原
- **中英双语** — 支持中文 / English 切换
- **键盘快捷键** — `Shift+C` 复制 JSON，`Shift+S` 保存备忘录

## 技术栈

- [Vue 3](https://vuejs.org/) + TypeScript
- [Vite 8](https://vite.dev/)
- [Nuxt UI 4](https://ui.nuxt.com/) (Vite 模式)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/) 状态管理
- [Vue I18n](https://vue-i18n.intlify.dev/) 国际化
- [Vue Router](https://router.vuejs.org/)

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查 + 构建
pnpm build

# 预览生产构建
pnpm preview
```

> 要求 Node.js `^20.19.0 || >=22.12.0`

## 项目结构

```
src/
├── assets/css/       # 全局样式
├── components/       # 通用组件（AppHeader、SectionCard、HistoryPanel 等）
├── i18n/locales/     # 中英文语言包
├── router/           # 路由配置
├── stores/           # Pinia 状态（form、history）
├── views/            # 页面视图（FormView）
├── App.vue
└── main.ts
```

## 代码规范

```bash
# Lint（oxlint + eslint）
pnpm lint

# 格式化
pnpm format
```

## 许可证

MIT
