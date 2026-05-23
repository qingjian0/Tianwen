/**
 * 古籍引擎
 */

import {
  ClassicContent,
  Chapter,
  Verse,
  SchoolOfInterpretation,
  LineAnnotation,
} from "./types";
import {
  ZHOUYI_CONTENT,
  ZHOUYI_INTERPRETATION_SCHOOLS,
} from "./zhouyi-content";

export class ClassicEngine {
  private classics: Map<string, ClassicContent> = new Map();
  private schools: Map<string, SchoolOfInterpretation> = new Map();

  constructor() {
    this.registerClassic("zhouyi", ZHOUYI_CONTENT);
    ZHOUYI_INTERPRETATION_SCHOOLS.forEach((school) => {
      this.schools.set(school.id, school);
    });
  }

  registerClassic(id: string, content: ClassicContent) {
    this.classics.set(id, content);
  }

  getClassic(id: string): ClassicContent | undefined {
    return this.classics.get(id);
  }

  getChapter(classicId: string, chapterId: string): Chapter | undefined {
    const classic = this.classics.get(classicId);
    if (!classic) return undefined;

    for (const version of Object.values(classic.versions)) {
      const chapter = version.chapters.find((c) => c.id === chapterId);
      if (chapter) return chapter;
    }
    return undefined;
  }

  getVerse(
    classicId: string,
    chapterId: string,
    verseNumber: number,
  ): Verse | undefined {
    const chapter = this.getChapter(classicId, chapterId);
    return chapter?.verses?.find((v) => v.number === verseNumber);
  }

  getSchool(schoolId: string): SchoolOfInterpretation | undefined {
    return this.schools.get(schoolId);
  }

  getAllSchools(): SchoolOfInterpretation[] {
    return Array.from(this.schools.values());
  }

  getInterpretationForLine(
    classicId: string,
    chapterId: string,
    lineNumber: number,
    schoolId: string,
  ): string | undefined {
    const verse = this.getVerse(classicId, chapterId, lineNumber);
    const annotation = verse?.lineAnnotations?.find(
      (a) => a.lineNumber === lineNumber,
    );
    return annotation?.interpretations?.[schoolId];
  }

  getOriginalText(
    classicId: string,
    chapterId: string,
    verseNumber?: number,
  ): string | undefined {
    const verse = verseNumber
      ? this.getVerse(classicId, chapterId, verseNumber)
      : undefined;
    if (verse) return verse.original;

    const chapter = this.getChapter(classicId, chapterId);
    return chapter?.content;
  }

  getVernacular(
    classicId: string,
    chapterId: string,
    verseNumber?: number,
  ): string | undefined {
    const verse = verseNumber
      ? this.getVerse(classicId, chapterId, verseNumber)
      : undefined;
    return verse?.vernacular;
  }
}
