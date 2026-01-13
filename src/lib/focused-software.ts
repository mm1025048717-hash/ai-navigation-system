/**
 * 聚焦软件策略
 * 基于风险分析，优先深度支持少数核心软件
 */

export type FocusedSoftware = 
  | "figma"      // Phase 1: 设计工具代表
  | "salesforce" // Phase 1: CRM 系统代表
  | "sap";       // Phase 1: ERP 系统代表

export type ExtendedSoftware = 
  | "premiere"
  | "photoshop"
  | "notion"
  | "tableau"
  | "jira"
  | "slack"
  | "hubspot"
  | "ide"
  | "reddit"
  | "custom";

export type AllSoftware = FocusedSoftware | ExtendedSoftware;

/**
 * Phase 1 聚焦软件配置
 * 这些软件将获得：
 * - 更详细的 UI 元素库
 * - 更准确的步骤规划
 * - 优先的错误处理
 * - 深度优化
 */
export const FOCUSED_SOFTWARE: Record<FocusedSoftware, {
  name: string;
  category: "design" | "crm" | "erp";
  priority: number;
  uiElementLibrary: boolean;
  deepOptimization: boolean;
  estimatedAccuracy: number; // 0-100
}> = {
  figma: {
    name: "Figma",
    category: "design",
    priority: 1,
    uiElementLibrary: true,
    deepOptimization: true,
    estimatedAccuracy: 85,
  },
  salesforce: {
    name: "Salesforce",
    category: "crm",
    priority: 2,
    uiElementLibrary: true,
    deepOptimization: true,
    estimatedAccuracy: 80,
  },
  sap: {
    name: "SAP",
    category: "erp",
    priority: 3,
    uiElementLibrary: true,
    deepOptimization: true,
    estimatedAccuracy: 75,
  },
};

/**
 * 扩展软件配置
 * 这些软件使用通用适配，准确率较低
 */
export const EXTENDED_SOFTWARE: Record<ExtendedSoftware, {
  name: string;
  category: string;
  priority: number;
  uiElementLibrary: boolean;
  deepOptimization: boolean;
  estimatedAccuracy: number;
}> = {
  premiere: {
    name: "Premiere Pro",
    category: "video",
    priority: 4,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 60,
  },
  photoshop: {
    name: "Photoshop",
    category: "design",
    priority: 5,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 60,
  },
  notion: {
    name: "Notion",
    category: "productivity",
    priority: 6,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 65,
  },
  tableau: {
    name: "Tableau",
    category: "analytics",
    priority: 7,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 60,
  },
  jira: {
    name: "Jira",
    category: "project",
    priority: 8,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 65,
  },
  slack: {
    name: "Slack",
    category: "communication",
    priority: 9,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 70,
  },
  hubspot: {
    name: "HubSpot",
    category: "crm",
    priority: 10,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 60,
  },
  ide: {
    name: "IDE (PyCharm)",
    category: "development",
    priority: 11,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 55,
  },
  reddit: {
    name: "Reddit",
    category: "social",
    priority: 12,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 50,
  },
  custom: {
    name: "自定义软件",
    category: "custom",
    priority: 99,
    uiElementLibrary: false,
    deepOptimization: false,
    estimatedAccuracy: 40,
  },
};

/**
 * 检查软件是否为聚焦软件
 */
export function isFocusedSoftware(software: AllSoftware): software is FocusedSoftware {
  return software in FOCUSED_SOFTWARE;
}

/**
 * 获取软件配置
 */
export function getSoftwareConfig(software: AllSoftware) {
  if (isFocusedSoftware(software)) {
    return FOCUSED_SOFTWARE[software];
  }
  return EXTENDED_SOFTWARE[software as ExtendedSoftware];
}

/**
 * 获取软件准确率警告
 */
export function getAccuracyWarning(software: AllSoftware): string | null {
  const config = getSoftwareConfig(software);
  
  if (config.estimatedAccuracy < 70) {
    return `此软件使用通用适配，准确率约 ${config.estimatedAccuracy}%。建议上传详细的操作手册以提升准确率。`;
  }
  
  return null;
}
