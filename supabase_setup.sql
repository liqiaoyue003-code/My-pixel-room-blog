-- ============================================================
-- 像素小屋 — Supabase 建表 & 初始数据脚本
-- 在 Supabase 控制台 → SQL Editor 里执行
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. 确认 diary_entries 表结构
--    如果你的日记表名不叫 diary_entries，把下面两处改成你的表名
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diary_entries (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  mood        TEXT NOT NULL DEFAULT '平静',
  mood_color  TEXT NOT NULL DEFAULT 'blue',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 开启公开只读（如果 RLS 开着但没有 policy，查询会返回空）
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public read diary_entries"
  ON diary_entries FOR SELECT USING (true);


-- ─────────────────────────────────────────────────────────────
-- 2. project_sections 表（项目笔记 / 心得 / 代码块 / 总结）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_sections (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL,          -- 对应 projects 表的 id
  type        TEXT NOT NULL              -- 'text' | 'code' | 'tip' | 'highlight'
                CHECK (type IN ('text','code','tip','highlight')),
  heading     TEXT,
  content     TEXT NOT NULL,
  lang        TEXT,                      -- 代码块语言，如 'typescript' 'python' 'cpp'
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public read project_sections"
  ON project_sections FOR SELECT USING (true);


-- ─────────────────────────────────────────────────────────────
-- 3. course_sections 表（课程规划 / 心得 / 考核要求 / 真题）
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_sections (
  id          SERIAL PRIMARY KEY,
  course_id   INTEGER NOT NULL,          -- 对应 courses 表的 id
  type        TEXT NOT NULL              -- 'plan' | 'thought' | 'exam' | 'question'
                CHECK (type IN ('plan','thought','exam','question')),
  heading     TEXT,
  content     TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public read course_sections"
  ON course_sections FOR SELECT USING (true);


-- ─────────────────────────────────────────────────────────────
-- 4. 初始数据：project_sections（project_id 需与 projects 表对应）
-- ─────────────────────────────────────────────────────────────
INSERT INTO project_sections (project_id, type, heading, content, lang, sort_order) VALUES

-- project 1：像素小屋个人网站
(1, 'text', '为什么选 Vite + React？',
'之前用过 Create React App，但启动慢、热更新也慢。Vite 基于原生 ESM，冷启动几乎是瞬间的，HMR 也更精准。React 则是因为组件化思路更符合像素风这种「拼积木」的设计方式——每个房间元素都是一个独立组件。',
NULL, 0),

(1, 'tip', '💡 Tailwind 小技巧',
'用 clsx + tailwind-merge 来处理条件样式，可以避免类名冲突。像素风的卡片大量依赖 border + boxShadow offset，这部分用 Tailwind arbitrary values 写比 CSS 更直观：`shadow-[5px_5px_0_#2a5a7b]`。',
NULL, 1),

(1, 'code', 'Supabase 实时订阅示例',
'// 订阅数据库变更，实现内容实时刷新
const channel = supabase
  .channel("diary_changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "diary" },
    (payload) => {
      setEntries((prev) => [payload.new as DiaryEntry, ...prev]);
    }
  )
  .subscribe();

return () => supabase.removeChannel(channel);',
'typescript', 2),

(1, 'highlight', '最大的收获',
'把「想做一个好看的主页」这个模糊目标，拆成技术选型 → 设计系统 → 数据层 → 部署，每步都有具体产出。以后做项目时会更习惯先拆分再动手。',
NULL, 3),

-- project 2：CSS Grid & Flexbox
(2, 'text', 'Flexbox 的核心心智模型',
'Flex 是「一维」的——主轴方向排列，交叉轴对齐。把握住 justify-content（主轴分布）和 align-items（交叉轴对齐）这两个属性，90% 的场景都能搞定。flex-wrap 让它能换行，此时 align-content 才生效（控制多行的分布）。',
NULL, 0),

(2, 'code', '居中三件套',
'/* 方法一：Flex 居中（最常用）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法二：Grid 居中（更简洁）*/
.container {
  display: grid;
  place-items: center;
}

/* 方法三：absolute + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}',
'css', 1),

(2, 'text', 'Grid 什么时候比 Flex 更合适？',
'Grid 是「二维」的，行列同时控制。当设计稿有明确的网格结构时（如卡片列表、杂志排版、仪表盘），Grid 更自然。Flex 适合线性排列（导航栏、按钮组、表单行）。两者可以嵌套使用：Grid 做整体骨架，Flex 做局部排列。',
NULL, 2),

(2, 'tip', '💡 grid-template-areas 神器',
'用命名区域布局，代码可读性极高。写页面骨架时先画区域名，比调 column-start/end 直观很多。配合 repeat(auto-fill, minmax()) 做响应式卡片列表，几乎不需要写媒体查询。',
NULL, 3),

-- project 3：数学建模竞赛
(3, 'text', '比赛流程回顾',
'拿到题目后三人先花 30 分钟各自头脑风暴，然后合并思路定方向。我负责数据清洗和可视化，另外两人负责建模和论文写作。分工清晰比谁都全包要高效得多——这是第一次感受到协作的力量。',
NULL, 0),

(3, 'code', '数据清洗常用片段',
'import pandas as pd
import numpy as np

df = pd.read_csv("data.csv", encoding="gbk")

num_cols = df.select_dtypes(include=np.number).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

for col in num_cols:
    mu, sigma = df[col].mean(), df[col].std()
    df = df[df[col].between(mu - 3*sigma, mu + 3*sigma)]

print(f"清洗后剩余 {len(df)} 条数据")',
'python', 1),

(3, 'tip', '💡 可视化建议',
'比赛论文里的图要「自解释」：标题说明结论而非内容，颜色用色盲友好色板，关键数据点加注释。matplotlib 的 annotate() 很好用。',
NULL, 2),

(3, 'highlight', '反思与改进',
'时间管理是最大的坑：我们花了过多时间在数据探索上，论文部分写得很仓促。下次应该倒排时间节点，提前 8 小时预留论文润色时间。',
NULL, 3),

-- project 4：校级编程挑战赛
(4, 'text', '贪心算法的判断思路',
'贪心的关键是证明「局部最优能推出全局最优」。常见贪心场景：区间调度（按结束时间排序）、分配问题（排序后双指针）、哈夫曼编码（优先队列）。不确定能不能贪心时，先想反例——如果举不出来，大概率可以。',
NULL, 0),

(4, 'code', '区间调度最大化（经典贪心）',
'#include <bits/stdc++.h>
using namespace std;

int maxActivities(vector<pair<int,int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b){ return a.second < b.second; });

    int count = 0, lastEnd = INT_MIN;
    for (auto& [start, end] : intervals) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return count;
}',
'cpp', 1),

(4, 'text', 'DP 的状态定义套路',
'DP 最难的不是转移方程，是状态定义。我的方法：先想「我在第 i 步，已知什么、要求什么」，然后把「已知的关键信息」塞进状态里。背包类 dp[i][j] = 前 i 个物品用 j 容量的最大价值；序列类 dp[i] = 以第 i 个元素结尾的最优解。',
NULL, 2),

(4, 'highlight', '比赛心态复盘',
'第三轮卡在一道题上花了太长时间，导致后面简单题没时间做。教训：比赛时先过所有容易题，难题标记跳过，最后再回头攻。分不到满分的题，能拿部分分也值得。',
NULL, 3);


-- ─────────────────────────────────────────────────────────────
-- 5. 初始数据：course_sections（course_id 需与 courses 表对应）
-- ─────────────────────────────────────────────────────────────
INSERT INTO course_sections (course_id, type, heading, content, sort_order) VALUES

-- course 1：React 完全指南
(1, 'plan', '学习路线与目标',
'分三个阶段：
① 基础夯实（已完成）：JSX、组件、Props、State、事件处理
② 进阶（进行中）：Hooks 全家桶、React Router、Context、性能优化
③ 实战：用 React + Supabase 做完整项目，目标是当前这个个人网站

每天至少 1 小时，周末做练手项目，争取两个月内 100% 完成。',
0),

(1, 'thought', 'useState vs useReducer 的选择',
'学到状态管理那章的时候卡了很久。后来总结：状态之间有依赖关系、或者有多个子动作修改同一状态，就用 useReducer；简单的独立值直接 useState 即可。不要过度设计。

useEffect 的依赖数组是我踩坑最多的地方——用 eslint-plugin-react-hooks 可以救命，它会提示你漏写了哪些依赖。',
1),

(1, 'thought', '关于性能优化',
'React.memo、useMemo、useCallback 三件套——核心是「避免不必要的重新渲染」。但过早优化是万恶之源，先写正确的代码，发现性能问题再用 React DevTools Profiler 定位，然后有针对性地优化。不要每个组件都包一层 memo。',
2),

-- course 3：数据结构与算法
(3, 'plan', '备考计划',
'期末考试时间：2024 年 6 月末

剩余章节：图论（BFS/DFS/最短路）、动态规划、排序算法分析

计划：
- 每周刷 5 道 LeetCode（按章节专题刷）
- 考前两周做历年真题，找出错题规律
- 重点攻坚：动态规划（状态定义是难点）',
0),

(3, 'exam', '考核要求',
'【考试形式】
闭卷笔试，时长 2 小时

【题型分布】
• 选择题 × 20（每题 2 分，共 40 分）——基本概念、时间复杂度判断
• 填空题 × 5（每题 4 分，共 20 分）——算法执行过程填写
• 算法分析题 × 3（共 24 分）——分析给定算法的复杂度和正确性
• 算法设计题 × 2（共 16 分）——用伪代码或 C++ 写出算法

【重点章节】
链表操作、栈与队列、二叉树遍历、图的 BFS/DFS、排序算法（快排、归并、堆排）、动态规划基础',
1),

(3, 'question', '2023 年真题节选',
'【选择题示例】
Q: 对 n 个元素用堆排序，时间复杂度为？
A. O(n)　B. O(n log n)　C. O(n²)　D. O(log n)
答案：B

【填空题示例】
Q: 写出对序列 [5, 3, 8, 1, 9, 2] 进行快速排序（以第一个元素为基准）第一趟分区后的结果。
答案：[2, 3, 1, 5, 9, 8]

【算法设计题】
Q: 给定一棵二叉树，用非递归方式实现中序遍历，写出算法并分析时间/空间复杂度。
思路：维护一个栈，先把左子树全部入栈，再依次弹出访问，访问后把右子树入栈。
时间 O(n)，空间 O(h)（h 为树高）',
2),

-- course 5：线性代数
(5, 'exam', '考核要求',
'【考试形式】
闭卷笔试，时长 2 小时，允许携带计算器

【题型分布】
• 计算题 × 6（共 60 分）——行列式、矩阵运算、线性方程组、特征值
• 证明题 × 2（共 20 分）——向量空间、线性相关性证明
• 应用题 × 2（共 20 分）——最小二乘、二次型化标准形

【重点内容】
行列式展开、矩阵的秩与逆、齐次/非齐次线性方程组的解结构、特征值与特征向量、实对称矩阵的对角化、二次型',
0),

(5, 'question', '历年真题节选',
'【计算题】
Q: 求矩阵 A = [[2,1],[1,2]] 的特征值和特征向量。
解：det(A - λI) = (2-λ)² - 1 = 0
λ₁ = 1, λ₂ = 3
λ₁ = 1 对应特征向量：[1, -1]ᵀ
λ₂ = 3 对应特征向量：[1, 1]ᵀ

【证明题】
Q: 证明：若 A 是 n 阶可逆矩阵，则 A 的列向量组线性无关。
思路：若 Ax = 0，因 A 可逆故 x = A⁻¹·0 = 0，即方程组只有零解，故列向量线性无关。',
1),

(5, 'thought', '理解特征值的几何含义',
'一直死记公式，后来看到一个解释豁然开朗：特征向量是矩阵变换后「方向不变」的向量，特征值是沿该方向的伸缩比例。

理解了这个，PCA（主成分分析）的原理就自然理解了——找协方差矩阵最大特征值对应的特征向量方向，就是数据方差最大的方向。数学和应用之间有了连接，就不容易忘了。',
2);
