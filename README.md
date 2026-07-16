# 书单森林 · 阅读管理助手

> 一个沉浸式的个人书单管理工具，帮助你整理阅读足迹，记录读书感想。
**在线体验**：https://book-manager.netlify.app

---

## 功能一览

- **智能导入** —— 粘贴书单文字，自动解析书名、作者和感想，批量导入
- **分类管理** —— 自定义创建/删除分类，为书籍打标签
- **搜索与筛选** —— 按书名/作者搜索，按分类过滤
- **双视图切换** —— 网格/列表两种展示模式，自由切换
- **完整 CRUD** —— 添加、编辑、删除书籍，记录评分和感想
- **数据统计** —— 总本数、已读本数、分类数量一目了然
-  *治愈系 UI** —— 春日森林风格，毛玻璃质感，低对比护眼设计

---

## 🛠️ 技术栈

| 技术 | 用途 |
| :--- | :--- |
| **React 18** | UI 框架 |
| **Vite** | 构建工具 |
| **Tailwind CSS v4** | 样式系统 |
| **Dexie.js** | IndexedDB 本地数据库（数据存在浏览器中） |
| **Git + GitHub** | 版本控制与代码托管 |
| **Netlify** | 免费部署与托管（CDN 分发） |

---

## 🗂️ 项目结构

```
book-manager/
├── src/
│   ├── components/
│   │   ├── BookCard.jsx         # 书籍卡片
│   │   ├── CategoryManager.jsx  # 分类管理弹窗
│   │   ├── EditModal.jsx        # 编辑/新增弹窗
│   │   ├── ImportModal.jsx      # 智能导入弹窗
│   │   └── StatCard.jsx         # 统计卡片
│   ├── utils/
│   │   ├── categoryStorage.js   # 分类本地存储工具
│   │   └── parser.js            # 书单文字解析器
│   ├── db.js                    # Dexie 数据库操作
│   ├── App.jsx                  # 主应用（含侧边栏布局）
│   ├── app.css                  # 全局样式（春日森林主题）
│   └── main.jsx                 # 入口文件
├── public/
├── index.html
├── package.json
├── tailwind.config.js           # Tailwind 配置（含主题色）
├── postcss.config.js            # PostCSS + Tailwind v4
└── vite.config.js
```
---

## 本地运行步骤

# 克隆项目
git clone https://github.com/treeszZZ/book-manager.git
cd book-manager

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173


---

所有书单数据存储在**浏览器本地 IndexedDB** 中，不上传任何服务器。

---

## 更新计划

- [ ] 导出/导入 JSON 数据备份
- [ ] 阅读进度追踪（在读天数）
- [ ] 暗色模式
- [ ] 按评分排序
- [ ] PWA 支持（离线可用）

---
第一次vibecoding。感谢阅读。
                             来自treeszZZ