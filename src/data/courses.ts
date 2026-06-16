export type CourseSectionType = "plan" | "thought" | "exam" | "question";

export interface CourseSection {
  type: CourseSectionType;
  heading?: string;
  content: string;
}

export interface Course {
  id: number;
  name: string;
  platform: string;
  category: string;
  category_color: string;
  progress: number;
  notes: string;
  created_at: string;
  sections?: CourseSection[];
}

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    name: "React 完全指南",
    platform: "Udemy",
    category: "前端开发",
    category_color: "blue",
    progress: 72,
    created_at: "2024-03-01",
    notes: "已完成 Hooks、Router、状态管理章节，正在学习性能优化部分。",
    sections: [
      {
        type: "plan",
        heading: "学习路线与目标",
        content:
          "分三个阶段：\n① 基础夯实（已完成）：JSX、组件、Props、State、事件处理\n② 进阶（进行中）：Hooks 全家桶、React Router、Context、性能优化\n③ 实战：用 React + Supabase 做完整项目，目标是当前这个个人网站\n\n每天至少 1 小时，周末做练手项目，争取两个月内 100% 完成。",
      },
      {
        type: "thought",
        heading: "useState vs useReducer 的选择",
        content:
          "学到状态管理那章的时候卡了很久。后来总结：状态之间有依赖关系、或者有多个子动作修改同一状态，就用 useReducer；简单的独立值直接 useState 即可。不要过度设计。\n\nuseEffect 的依赖数组是我踩坑最多的地方——用 eslint-plugin-react-hooks 可以救命，它会提示你漏写了哪些依赖。",
      },
      {
        type: "thought",
        heading: "关于性能优化",
        content:
          "React.memo、useMemo、useCallback 三件套——核心是「避免不必要的重新渲染」。但过早优化是万恶之源，先写正确的代码，发现性能问题再用 React DevTools Profiler 定位，然后有针对性地优化。不要每个组件都包一层 memo。",
      },
    ],
  },
  {
    id: 2,
    name: "CSS Grid & Flexbox",
    platform: "FrontendMasters",
    category: "前端开发",
    category_color: "blue",
    progress: 100,
    created_at: "2024-02-01",
    notes: "全部完成！布局从此不再迷茫，强烈推荐。",
    sections: [
      {
        type: "thought",
        heading: "学完之后的感受",
        content:
          "这门课彻底改变了我写 CSS 的方式。以前靠 float 和各种 hack，现在 Flex + Grid 能解决 95% 的布局需求。\n\n最大的收获：理解了「一维 vs 二维」的心智模型，知道什么场景用哪个。以前碰到复杂布局会焦虑，现在先分析方向（行/列还是二维网格），思路就清晰了。",
      },
      {
        type: "plan",
        heading: "下一步计划",
        content:
          "布局算是掌握了，接下来想深入：\n① CSS 动画和过渡（transition / animation / @keyframes）\n② CSS 变量和设计 token 系统\n③ 响应式设计原则（Container Queries 是新趋势）\n\n计划用一个月时间把动画部分系统学一遍，目标是能做出丝滑的交互效果。",
      },
    ],
  },
  {
    id: 3,
    name: "数据结构与算法",
    platform: "课堂",
    category: "计算机基础",
    category_color: "purple",
    progress: 60,
    created_at: "2024-01-01",
    notes: "树和图的部分还需要多刷题，动规刚刚起步。",
    sections: [
      {
        type: "plan",
        heading: "备考计划",
        content:
          "期末考试时间：2024 年 6 月末\n\n剩余章节：图论（BFS/DFS/最短路）、动态规划、排序算法分析\n\n计划：\n- 每周刷 5 道 LeetCode（按章节专题刷）\n- 考前两周做历年真题，找出错题规律\n- 重点攻坚：动态规划（状态定义是难点）",
      },
      {
        type: "exam",
        heading: "考核要求",
        content:
          "【考试形式】\n闭卷笔试，时长 2 小时\n\n【题型分布】\n• 选择题 × 20（每题 2 分，共 40 分）——基本概念、时间复杂度判断\n• 填空题 × 5（每题 4 分，共 20 分）——算法执行过程填写\n• 算法分析题 × 3（共 24 分）——分析给定算法的复杂度和正确性\n• 算法设计题 × 2（共 16 分）——用伪代码或 C++ 写出算法\n\n【重点章节】\n链表操作、栈与队列、二叉树遍历、图的 BFS/DFS、排序算法（快排、归并、堆排）、动态规划基础",
      },
      {
        type: "question",
        heading: "2023 年真题节选",
        content:
          "【选择题示例】\nQ: 对 n 个元素用堆排序，时间复杂度为？\nA. O(n)　B. O(n log n)　C. O(n²)　D. O(log n)\n答案：B\n\n【填空题示例】\nQ: 写出对序列 [5, 3, 8, 1, 9, 2] 进行快速排序（以第一个元素为基准）第一趟分区后的结果。\n答案：[2, 3, 1, 5, 9, 8]（基准 5 就位，左边均小于 5，右边均大于 5）\n\n【算法设计题】\nQ: 给定一棵二叉树，用非递归方式实现中序遍历，写出算法并分析时间/空间复杂度。\n思路提示：维护一个栈，先把左子树全部入栈，再依次弹出访问，访问后把右子树入栈。\n时间 O(n)，空间 O(h)（h 为树高）",
      },
      {
        type: "question",
        heading: "2022 年真题节选",
        content:
          "【算法分析题】\nQ: 分析以下代码的时间复杂度：\n\nfor i in range(n):\n    j = 1\n    while j < n:\n        j *= 2\n\n外层 O(n)，内层每次翻倍所以 O(log n)，总时间复杂度 O(n log n)。\n\n【动态规划题】\nQ: 用动态规划求解「最长公共子序列」（LCS），给出状态转移方程。\ndp[i][j] = dp[i-1][j-1] + 1，若 A[i] == B[j]\ndp[i][j] = max(dp[i-1][j], dp[i][j-1])，否则\n初始化：dp[0][*] = dp[*][0] = 0",
      },
    ],
  },
  {
    id: 4,
    name: "Python 数据分析",
    platform: "网易公开课",
    category: "数据",
    category_color: "orange",
    progress: 45,
    created_at: "2023-12-01",
    notes: "pandas 和 matplotlib 部分已掌握，机器学习章节还没开始。",
    sections: [
      {
        type: "plan",
        heading: "学习规划",
        content:
          "当前进度：数据清洗（pandas）+ 可视化（matplotlib/seaborn）✅\n\n下阶段：\n① scikit-learn 基础——线性回归、决策树、随机森林\n② 特征工程——编码、归一化、缺失值处理\n③ 实战项目：找一个 Kaggle 入门竞赛（Titanic 或 House Prices）做完整流程\n\n目标：学完后能独立完成一个完整的数据分析项目，从数据获取到可视化报告。",
      },
      {
        type: "thought",
        heading: "pandas 的一些坑",
        content:
          "1. 链式赋值警告（SettingWithCopyWarning）：用 .loc[] 而不是 df[col][row] 来修改值，避免操作的是副本。\n\n2. groupby 之后记得 reset_index()，不然索引会变多级很麻烦。\n\n3. merge 之前先检查 key 列有没有重复值，否则会产生意外的笛卡尔积。\n\n4. 处理日期时 pd.to_datetime() 很好用，format 参数指定格式能加速解析。",
      },
    ],
  },
  {
    id: 5,
    name: "线性代数",
    platform: "课堂",
    category: "数学",
    category_color: "green",
    progress: 80,
    created_at: "2023-11-01",
    notes: "特征值和特征向量部分反复看了三遍，终于理解了。",
    sections: [
      {
        type: "exam",
        heading: "考核要求",
        content:
          "【考试形式】\n闭卷笔试，时长 2 小时，允许携带计算器\n\n【题型分布】\n• 计算题 × 6（共 60 分）——行列式、矩阵运算、线性方程组、特征值\n• 证明题 × 2（共 20 分）——向量空间、线性相关性证明\n• 应用题 × 2（共 20 分）——最小二乘、二次型化标准形\n\n【重点内容】\n行列式展开、矩阵的秩与逆、齐次/非齐次线性方程组的解结构、特征值与特征向量、实对称矩阵的对角化、二次型",
      },
      {
        type: "question",
        heading: "历年真题节选",
        content:
          "【计算题】\nQ: 求矩阵 A = [[2,1],[1,2]] 的特征值和特征向量。\n解：det(A - λI) = (2-λ)² - 1 = 0\nλ₁ = 1, λ₂ = 3\nλ₁ = 1 对应特征向量：[1, -1]ᵀ\nλ₂ = 3 对应特征向量：[1, 1]ᵀ\n\n【证明题】\nQ: 证明：若 A 是 n 阶可逆矩阵，则 A 的列向量组线性无关。\n思路：若 Ax = 0，因 A 可逆故 x = A⁻¹·0 = 0，即方程组只有零解，故列向量线性无关。",
      },
      {
        type: "thought",
        heading: "理解特征值的几何含义",
        content:
          "一直死记公式，后来看到一个解释豁然开朗：特征向量是矩阵变换后「方向不变」的向量，特征值是沿该方向的伸缩比例。\n\n理解了这个，PCA（主成分分析）的原理就自然理解了——找协方差矩阵最大特征值对应的特征向量方向，就是数据方差最大的方向。数学和应用之间有了连接，就不容易忘了。",
      },
    ],
  },
];
