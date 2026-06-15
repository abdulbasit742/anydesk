export interface OverlayAnnotation {
  id: string;
  x: number;
  y: number;
  text?: string;
}

export function filterVisibleAnnotations(items: readonly OverlayAnnotation[]): OverlayAnnotation[] {
  return items.filter((item) => item.x >= 0 && item.x <= 1 && item.y >= 0 && item.y <= 1);
}
