
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string; // ISO String YYYY-MM-DD
  timestamp: number; // For sorting
  isAiGenerated: boolean;
  type: TransactionType;
}

export interface AiParseResponse {
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  type: TransactionType;
}

export type Language = 'en' | 'zh';

export type ViewMode = 'WEEK' | 'MONTH' | 'YEAR';
export type YearGranularity = 'BY_MONTH' | 'BY_WEEK';

export const TRANSLATIONS = {
  en: {
    title: "GARLIC ARCHIVE",
    subtitle: "PERSONAL FINANCE INDEX v1.2",
    online: "ONLINE",
    entries: "ENTRIES",
    navArchive: "ARCHIVE",
    navMetrics: "METRICS",
    inputTab: "TEXT",
    voiceTab: "VOICE",
    processing: "PROCESSING INPUT...",
    textPlaceholder: "e.g. Received 5000 salary, or Spent 50 on coffee...",
    logBtn: "LOG ENTRY",
    recording: "RECORDING...",
    startRecord: "START RECORDING",
    stopRecord: "STOP RECORDING",
    voiceHint: "Speak naturally. Include amount and item.",
    totalActivity: "NET BALANCE GRID",
    totalBalance: "NET POSITION",
    analyticsTitle: "ANALYTIC REPORT",
    noData: "NO DATA ARCHIVED",
    noDataSub: "Use the input panel to add your first entry.",
    designedBy: "DESIGNED WITH GARLIC LOGIC",
    filters: {
        all: "ALL",
        income: "INCOME",
        expense: "EXPENSE"
    },
    analytics: {
        trend: "TREND",
        distribution: "DISTRIBUTION",
        table: "TABLE",
        category: "CATEGORY",
        count: "QTY",
        sum: "TOTAL"
    },
    views: {
        week: "WEEK",
        month: "MONTH",
        year: "YEAR",
        byMonth: "BY MONTH",
        byWeek: "BY WEEK"
    },
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel"
  },
  zh: {
    title: "大蒜档案",
    subtitle: "个人财务索引 v1.2",
    online: "在线",
    entries: "条目",
    navArchive: "档案库",
    navMetrics: "数据指标",
    inputTab: "文本",
    voiceTab: "语音",
    processing: "正在处理...",
    textPlaceholder: "例如：收到工资5000元，或者买咖啡花了50...",
    logBtn: "记录条目",
    recording: "正在录音...",
    startRecord: "开始录音",
    stopRecord: "停止录音",
    voiceHint: "自然说话。包含金额和项目。",
    totalActivity: "净值网格",
    totalBalance: "净资产",
    analyticsTitle: "数据分析报告",
    noData: "暂无档案数据",
    noDataSub: "使用输入面板添加您的第一条记录。",
    designedBy: "基于大蒜逻辑设计",
    filters: {
        all: "全部",
        income: "收入",
        expense: "支出"
    },
    analytics: {
        trend: "趋势",
        distribution: "分布",
        table: "表格",
        category: "类别",
        count: "数量",
        sum: "总额"
    },
    views: {
        week: "周",
        month: "月",
        year: "年",
        byMonth: "按月",
        byWeek: "按周"
    },
    edit: "编辑",
    delete: "删除",
    save: "保存",
    cancel: "取消"
  }
};
