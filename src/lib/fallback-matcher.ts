/**
 * 降级方案：基于知识库的规则匹配
 * 当视觉 AI 无法识别 UI 元素时，使用基于文本描述的规则匹配
 */

export interface UIRule {
  id: string;
  stepDescription: string;
  keywords: string[];
  elementType: "button" | "menu" | "input" | "tab" | "link" | "icon";
  position?: "top" | "left" | "right" | "bottom" | "center";
  fallbackSelector?: string;
}

export interface SoftwareRules {
  software: string;
  version?: string;
  rules: UIRule[];
}

/**
 * 基于步骤描述匹配 UI 元素
 */
export function matchUIElement(
  stepDescription: string,
  software: string,
  rules: SoftwareRules[]
): UIRule | null {
  const softwareRules = rules.find(r => r.software === software);
  if (!softwareRules) return null;

  const lowerDescription = stepDescription.toLowerCase();

  // 按匹配度排序
  const matches = softwareRules.rules
    .map(rule => {
      const matchCount = rule.keywords.filter(keyword =>
        lowerDescription.includes(keyword.toLowerCase())
      ).length;
      return { rule, score: matchCount };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return matches.length > 0 ? matches[0].rule : null;
}

/**
 * 从知识库文档中提取 UI 规则
 */
export function extractRulesFromDocument(
  content: string,
  software: string
): UIRule[] {
  const rules: UIRule[] = [];
  
  // 匹配模式：步骤描述中包含 UI 元素信息
  const stepPattern = /(?:步骤|Step)\s*\d+[：:]\s*(.+?)(?:\n|$)/gi;
  const uiPattern = /(?:点击|选择|输入|打开)\s*(.+?)(?:按钮|菜单|输入框|标签|链接)/gi;

  let stepMatch;
  while ((stepMatch = stepPattern.exec(content)) !== null) {
    const stepText = stepMatch[1];
    const uiMatches = Array.from(stepText.matchAll(uiPattern));
    
    if (uiMatches.length > 0) {
      const keywords = uiMatches.map(m => m[1].trim());
      rules.push({
        id: `rule_${rules.length + 1}`,
        stepDescription: stepText.trim(),
        keywords,
        elementType: detectElementType(stepText),
        position: detectPosition(stepText),
      });
    }
  }

  return rules;
}

function detectElementType(text: string): UIRule["elementType"] {
  const lower = text.toLowerCase();
  if (lower.includes("按钮") || lower.includes("button")) return "button";
  if (lower.includes("菜单") || lower.includes("menu")) return "menu";
  if (lower.includes("输入") || lower.includes("input")) return "input";
  if (lower.includes("标签") || lower.includes("tab")) return "tab";
  if (lower.includes("链接") || lower.includes("link")) return "link";
  return "icon";
}

function detectPosition(text: string): UIRule["position"] | undefined {
  const lower = text.toLowerCase();
  if (lower.includes("顶部") || lower.includes("top")) return "top";
  if (lower.includes("左侧") || lower.includes("left")) return "left";
  if (lower.includes("右侧") || lower.includes("right")) return "right";
  if (lower.includes("底部") || lower.includes("bottom")) return "bottom";
  if (lower.includes("中间") || lower.includes("center")) return "center";
  return undefined;
}
