/**
 * 古籍系统类型定义
 */

export interface ClassicMetadata {
  id: string;
  name: string;
  author?: string;
  dynasty?: string;
  category: 'zhouyi' | 'meihua' | 'liuyao' | 'bazi' | 'qimen' | 'ziwei';
  tags?: string[];
  description?: string;
}

export interface LineAnnotation {
  lineNumber: number;
  original: string;
  vernacular?: string;
  commentary?: string;
  interpretations?: {
    [school: string]: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  content?: string;
  annotations?: LineAnnotation[];
  verses?: Verse[];
}

export interface Verse {
  id: string;
  number: number;
  original: string;
  vernacular?: string;
  commentary?: string;
  lineAnnotations?: LineAnnotation[];
}

export interface ClassicContent {
  metadata: ClassicMetadata;
  versions: {
    [versionKey: string]: {
      title: string;
      chapters: Chapter[];
    };
  };
  rules?: string[];
  relatedCases?: string[];
}

export interface SchoolOfInterpretation {
  id: string;
  name: string;
  category: 'classical' | 'image-number' | 'philosophical' | 'jingfang' | 'takashima' | 'modern-ai';
  description: string;
}

export type ClassicContentMap = Record<string, ClassicContent>;
