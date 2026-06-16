export type NoteType = "text" | "code" | "tip" | "highlight";

export interface NoteSection {
  type: NoteType;
  heading?: string;
  content: string;
  lang?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: "学习" | "竞赛";
  tags: { label: string; color: string }[];
  link?: string;
  date: string;
  created_at: string;
  notes?: NoteSection[];
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    category: "学习",
    date: "2024.03",
    created_at: "2024-03-01",
    title: "像素小屋个人网站",
    link: "",
    description: "用 React + Vite + Tailwind CSS + Supabase 搭建的个人网站，像素风格，内容实时更新。",
    tags: [
      { label: "React", color: "blue" },
      { label: "Tailwind", color: "teal" },
      { label: "Supabase", color: "green" },
    ],
    notes: [
      {
        type: "text",
        heading: "为什么选 Vite + React？",
        content:
          "之前用过 Create React App，但启动慢、热更新也慢。Vite 基于原生 ESM，冷启动几乎是瞬间的，HMR 也更精准。React 则是因为组件化思路更符合像素风这种「拼积木」的设计方式——每个房间元素都是一个独立组件。",
      },
      {
        type: "tip",
        heading: "💡 Tailwind 小技巧",
        content:
          "用 clsx + tailwind-merge 来处理条件样式，可以避免类名冲突。像素风的卡片大量依赖 border + boxShadow offset，这部分用 Tailwind arbitrary values 写比 CSS 更直观：`shadow-[5px_5px_0_#2a5a7b]`。",
      },
      {
        type: "code",
        heading: "Supabase 实时订阅示例",
        lang: "typescript",
        content: `// 订阅数据库变更，实现内容实时刷新
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

return () => supabase.removeChannel(channel);`,
      },
      {
        type: "highlight",
        heading: "最大的收获",
        content:
          "把「想做一个好看的主页」这个模糊目标，拆成技术选型 → 设计系统 → 数据层 → 部署，每步都有具体产出。以后做项目时会更习惯先拆分再动手。",
      },
    ],
  },
  {
    id: 2,
    category: "学习",
    date: "2024.02",
    created_at: "2024-02-01",
    title: "CSS Grid & Flexbox 系统整理",
    link: "",
    description: "系统整理了 Grid 和 Flexbox 的所有用法，做了一套练习项目，现在排版布局很少查文档了。",
    tags: [
      { label: "CSS", color: "purple" },
      { label: "布局", color: "blue" },
    ],
    notes: [
      {
        type: "text",
        heading: "Flexbox 的核心心智模型",
        content:
          "Flex 是「一维」的——主轴方向排列，交叉轴对齐。把握住 justify-content（主轴分布）和 align-items（交叉轴对齐）这两个属性，90% 的场景都能搞定。flex-wrap 让它能换行，此时 align-content 才生效（控制多行的分布）。",
      },
      {
        type: "code",
        heading: "居中三件套",
        lang: "css",
        content: `/* 方法一：Flex 居中（最常用）*/
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
}`,
      },
      {
        type: "text",
        heading: "Grid 什么时候比 Flex 更合适？",
        content:
          "Grid 是「二维」的，行列同时控制。当设计稿有明确的网格结构时（如卡片列表、杂志排版、仪表盘），Grid 更自然。Flex 适合线性排列（导航栏、按钮组、表单行）。两者可以嵌套使用：Grid 做整体骨架，Flex 做局部排列。",
      },
      {
        type: "tip",
        heading: "💡 grid-template-areas 神器",
        content:
          "用命名区域布局，代码可读性极高。写页面骨架时先画区域名，比调 column-start/end 直观很多。配合 repeat(auto-fill, minmax()) 做响应式卡片列表，几乎不需要写媒体查询。",
      },
      {
        type: "code",
        heading: "响应式卡片网格",
        lang: "css",
        content: `/* 自动填充列，每列最小200px，最大1fr */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 命名区域布局示例 */
.page-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
}`,
      },
    ],
  },
  {
    id: 3,
    category: "竞赛",
    date: "2023.11",
    created_at: "2023-11-01",
    title: "数学建模竞赛",
    link: "",
    description: "三人小组参加校级数学建模，负责数据处理和可视化，使用 Python + matplotlib。获得二等奖。",
    tags: [
      { label: "Python", color: "orange" },
      { label: "数学建模", color: "pink" },
      { label: "二等奖", color: "green" },
    ],
    notes: [
      {
        type: "text",
        heading: "比赛流程回顾",
        content:
          "拿到题目后三人先花 30 分钟各自头脑风暴，然后合并思路定方向。我负责数据清洗和可视化，另外两人负责建模和论文写作。分工清晰比谁都全包要高效得多——这是第一次感受到协作的力量。",
      },
      {
        type: "code",
        heading: "数据清洗常用片段",
        lang: "python",
        content: `import pandas as pd
import numpy as np

# 读取数据，跳过无效行
df = pd.read_csv("data.csv", encoding="gbk")

# 处理缺失值：数值列用中位数填充
num_cols = df.select_dtypes(include=np.number).columns
df[num_cols] = df[num_cols].fillna(df[num_cols].median())

# 去除明显异常值（3σ 原则）
for col in num_cols:
    mu, sigma = df[col].mean(), df[col].std()
    df = df[df[col].between(mu - 3*sigma, mu + 3*sigma)]

print(f"清洗后剩余 {len(df)} 条数据")`,
      },
      {
        type: "tip",
        heading: "💡 可视化建议",
        content:
          "比赛论文里的图要「自解释」：标题说明结论而非内容（写「XX 随时间增长趋势」不如写「XX 在 2020 年后加速上升」），颜色用色盲友好色板，关键数据点加注释。matplotlib 的 annotate() 很好用。",
      },
      {
        type: "highlight",
        heading: "反思与改进",
        content:
          "时间管理是最大的坑：我们花了过多时间在数据探索上，论文部分写得很仓促。下次应该倒排时间节点，提前 8 小时预留论文润色时间。另外，早点统一代码风格和文件命名，不然合并时很混乱。",
      },
    ],
  },
  {
    id: 4,
    category: "竞赛",
    date: "2023.10",
    created_at: "2023-10-01",
    title: "校级编程挑战赛",
    link: "",
    description: "算法题目为主，坚持到了第三轮，解出了贪心和动态规划的几道题，积累了不少经验。",
    tags: [
      { label: "算法", color: "teal" },
      { label: "C++", color: "blue" },
    ],
    notes: [
      {
        type: "text",
        heading: "贪心算法的判断思路",
        content:
          "贪心的关键是证明「局部最优能推出全局最优」。常见贪心场景：区间调度（按结束时间排序）、分配问题（排序后双指针）、哈夫曼编码（优先队列）。不确定能不能贪心时，先想反例——如果举不出来，大概率可以。",
      },
      {
        type: "code",
        heading: "区间调度最大化（经典贪心）",
        lang: "cpp",
        content: `#include <bits/stdc++.h>
using namespace std;

int maxActivities(vector<pair<int,int>>& intervals) {
    // 按结束时间升序排列
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
}`,
      },
      {
        type: "text",
        heading: "DP 的状态定义套路",
        content:
          "DP 最难的不是转移方程，是状态定义。我的方法：先想「我在第 i 步，已知什么、要求什么」，然后把「已知的关键信息」塞进状态里。背包类 dp[i][j] = 前 i 个物品用 j 容量的最大价值；序列类 dp[i] = 以第 i 个元素结尾的最优解。",
      },
      {
        type: "code",
        heading: "最长上升子序列（LIS）O(n log n)",
        lang: "cpp",
        content: `// patience sorting 思路，维护一个单调递增的 tails 数组
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
      },
      {
        type: "highlight",
        heading: "比赛心态复盘",
        content:
          "第三轮卡在一道题上花了太长时间，导致后面简单题没时间做，最终止步。教训：比赛时先过所有容易题，难题标记跳过，最后再回头攻。分不到满分的题，能拿部分分也值得。",
      },
    ],
  },
];
