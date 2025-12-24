<img width="2274" height="1420" alt="image" src="https://github.com/user-attachments/assets/a36aec6c-fef3-457c-8981-60010b2f9d87" /># 🧄 Garlic Archive | 大蒜档案
> **Personal Finance Index v1.2**  
> 一个基于实用主义逻辑、由 Gemini AI 驱动的个人财务索引工具。

<img width="2388" height="1082" alt="image" src="https://github.com/user-attachments/assets/fc5286a4-86fb-4ba0-85c5-ecc6bfb0ca4f" />
<img width="2318" height="818" alt="image" src="https://github.com/user-attachments/assets/0c8fa3dc-d364-47f1-820c-c873da3bfc1a" />
<img width="2274" height="1420" alt="image" src="https://github.com/user-attachments/assets/520a30f8-937c-4f38-8e88-f87289879b4e" />

---

## 👁️ 项目愿景 (Identity)
`Garlic Archive` 不仅仅是一个记账软件，它是一个财务“档案室”。设计灵感源自 Are.na 的极简主义与 GitHub 的数据颗粒感。它旨在通过最直观的交互（语音或文字），将混乱的日常开支转化为有序的结构化索引。

## 🚀 核心功能 (Core Functions)

### 1. 智能录入系统 (AI-Powered Input)
*   **自然语言解析**：无需手动选择类别，直接输入或点击“语音”说话。
    *   *例：“今天在星巴克买咖啡花了35块。”*
    *   *例：“收到本月工资15000元。”*
*   **Gemini 引擎**：自动识别金额、币种、日期、交易类型（收入/支出）并智能归类。

### 2. 双重视图架构 (Dual-View Logic)
*   **档案库 (ARCHIVE)**：专注于管理。
    *   **折叠式卡片**：默认极简列表，点击展开查看详情（备注、UUID、时间戳）。
    *   **高效过滤**：快速切换全量、收入与支出。
*   **指标看板 (METRICS)**：专注于分析。
    *   **热力图 (Heatmap)**：GitHub 风格的活跃度网格，直观感受资金流动的频率与强度。
    *   **趋势线 (Trend)**：最近15天的收支趋势。
    *   **分布图 (Pie)**：基于类别的支出占比分析。

### 3. 微互动设计 (UI/UX Details)
*   **新布鲁主义 (Neobrutalism)**：高对比度黑白配色，硬核的边框与阴影。
*   **动态动效**：入场动画、Tab 滑动轨迹、语音波纹反馈，提升操作的“确定感”。

## 🛠️ 技术栈 (Tech Stack)
*   **Frontend**: React 19 (Hooks, Context)
*   **Styling**: Tailwind CSS (Brutalist components)
*   **Intelligence**: Google Gemini 2.5 Flash API
*   **Charts**: Recharts & Custom SVG Grids
*   **Icons**: Lucide React
*   **Storage**: LocalStorage API (数据存储在您的浏览器本地，不上传云端)

## 📖 使用指南 (How to Use)
1. **环境准备**：确保应用已配置有效的 `API_KEY`（通过环境注入）。
2. **记录第一笔**：
   - 点击 **[TEXT]** 标签直接输入并按回车。
   - 点击 **[VOICE]** 标签开始说话，完成后点击停止。
3. **分析趋势**：切换至 **[METRICS]** 导航，查看您的财务热力分布与收支汇总。
4. **管理条目**：在 **[ARCHIVE]** 中点击卡片展开，可以进行二次编辑或彻底删除。

---

**Designed with Garlic Logic.**  
*(C) 2024 CORE_ARCHIVE. Stable Build 1.2.05*
