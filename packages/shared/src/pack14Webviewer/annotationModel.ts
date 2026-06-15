export type AnnotationTool = "pointer" | "rectangle" | "arrow" | "text";

export interface SessionAnnotation {
  id: string;
  tool: AnnotationTool;
  x: number;
  y: number;
  text?: string;
  createdByUserId: string;
  createdAt: string;
}

export function isAnnotationInBounds(annotation: SessionAnnotation): boolean {
  return annotation.x >= 0 && annotation.x <= 1 && annotation.y >= 0 && annotation.y <= 1;
}
