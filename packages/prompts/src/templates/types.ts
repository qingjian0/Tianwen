/**
 * Prompt Template Types
 */

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultSystems: string[];
  defaultFocus: string[];
  defaultStyle: string;
}
