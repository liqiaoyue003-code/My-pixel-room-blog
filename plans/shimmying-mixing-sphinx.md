# 个人网站全站规划

## Context

用户已完成首页（像素小屋入口）和房间导航页（8个可点击热区）的基础实现。
现在需要将每个热区连接到对应的内容页面，并接入 Supabase 作为数据层，
让用户能通过 Supabase 网页后台填写和上传内容，网站前端读取并展示。

---

## 技术架构

### 路由
React Router v7 已安装未使用。引入它替换现有 useState 页面切换。

路由表：
```
/              → HomePage（像素房间入口）
/room          → RoomPage（房间热区导航）
/diary         → 日记本页
/computer      → 电脑·项目学习页
/clouds        → 云朵·未来畅想页
/frame         → 相框·照片墙页
/food          → 食物·美食日记页
/cat           → 小猫·动物相遇页
/bookshelf     → 书架·课程学习页
/moon          → 月亮·？（见下方待确认）
```

### 数据层：Supabase
用户在 Supabase 网页 Table Editor 直接填写内容，Storage 上传图片，前端只读展示。

**数据表设计：**

| 表名 | 字段 | 对应页面 |
|------|------|---------|
| `diary_entries` | id, title, content, tags, mood, created_at | 日记本 |
| `projects` | id, title, description, category(学习/竞赛), tags, link, created_at | 电脑 |
| `future_thoughts` | id, title, content, category(工作/婚姻/人生), created_at | 云朵 |
| `photos` | id, image_url, caption, taken_at | 相框 |
| `food_entries` | id, name, description, image_url, location, rating, created_at | 食物 |
| `animal_entries` | id, name, description, image_url, location, created_at | 小猫 |
| `courses` | id, name, platform, category, progress(0-100), notes, created_at | 书架 |
| `moon_entries` | id, content, source, type(诗/随笔/语录), created_at | 月亮 |

Supabase Storage bucket：`images`（存放所有上传的照片）

---

## 各页面设计

所有内容页共用：
- 像素风像素/清爽配色（与房间页同调）
- 右上角「返回房间」按钮（使用 UI 资产中的 Return Button 样式）
- 页面顶部用对应像素素材图作装饰标题区

### 1. 日记本页 `/diary`
- 布局：瀑布流 / 网格卡片列表
- 每张卡片：纸质感（UI 资产 Card 样式），显示日期、标题、内容摘要、心情 Tag
- 点击卡片 → Modal 展开全文
- 情绪 Tag 颜色区分（UI 资产 Tag 组件）

### 2. 电脑·项目页 `/computer`
- 两栏 Tab：「学习项目」/ 「竞赛记录」
- 每项：卡片展示标题、描述、技术 Tag、外链按钮
- 可选：时间轴布局展示成长轨迹

### 3. 云朵·未来页 `/clouds`
- 梦幻云朵背景氛围
- 三个分类区：工作 / 婚姻 / 人生
- 每条思考：引言卡片样式，大字体，留白充足

### 4. 相框·照片墙 `/frame`
- Masonry 瀑布流图片网格
- 点击图片 → 全屏 Modal 查看 + 说明文字
- 图片来自 Supabase Storage

### 5. 食物·美食日记 `/food`
- 卡片列表：左图右文（图片 + 名称 + 描述 + 地点 + 评分星星）
- 轻松可爱的配色

### 6. 小猫·动物相遇 `/cat`
- 与食物页相似布局：卡片，图片 + 相遇描述 + 地点
- 用像素小猫素材作页面装饰

### 7. 书架·课程学习 `/bookshelf`
- 课程卡片：名称、平台、分类 Tag、进度条（0-100%）、笔记摘要
- 可按分类筛选

### 8. 月亮页 `/moon`
- 内容：诗句、随笔、心情语录，文字为主
- 布局：深夜星空/月光氛围背景，每条语录以大字引言卡片呈现
- Supabase 表：`moon_entries`（id, content, source, type[诗/随笔/语录], created_at）

---

## UI 组件复用（来自 UI 资产图 image-9.png）

| 组件 | 用在哪里 |
|------|---------|
| Card（纸质感） | 日记本、食物、小猫条目 |
| Button 实心 | 确认操作、外链跳转 |
| Button 描边 | 次要操作、筛选 |
| Tag | 心情标签、分类标签、技术栈 |
| Modal | 日记全文、照片全屏 |
| Return Button | 所有内容页右上角返回房间 |

shadcn/ui 中已有对应基础组件（`/src/app/components/ui/`），在其上叠加像素风样式。

---

## 实现步骤

1. **安装 Supabase 客户端** `@supabase/supabase-js`
2. **创建 `src/lib/supabase.ts`** — 初始化客户端（读取环境变量 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`）
3. **配置 React Router** — 改写 App.tsx，用 `<BrowserRouter>` + `<Routes>` 替换 useState 切换；RoomPage 热区点击改为 `useNavigate`
4. **建共用组件**
   - `ReturnButton.tsx` — 像素风返回按钮
   - `PageShell.tsx` — 页面外框（背景色、标题装饰、返回按钮）
   - `PixelCard.tsx` — 通用像素风卡片
   - `PixelTag.tsx` — 标签组件
   - `PhotoModal.tsx` — 图片全屏弹窗
5. **逐页实现**（顺序：日记本 → 食物 → 小猫 → 相框 → 云朵 → 书架 → 电脑 → 月亮）
6. **Supabase 接入** — 每页用自定义 hook（`useDiaryEntries`, `useFoodEntries`…）封装 fetch 逻辑

---

---

## 验证方式

1. 本地 dev server 启动，逐一点击房间热区验证路由跳转
2. 配置 Supabase 环境变量后，在 Supabase 后台插入测试数据，验证前端正确拉取显示
3. 测试返回按钮、Modal 开关、Tag 筛选等交互
4. 部署到 Vercel（连接 GitHub，设置环境变量），验证生产环境可访问
