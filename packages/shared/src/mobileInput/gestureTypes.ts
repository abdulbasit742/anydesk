export type TouchAction = 'move' | 'tap' | 'double_tap' | 'long_press' | 'pan' | 'pinch' | 'rotate' | 'scroll';

export interface TouchEventPayload {
  action: TouchAction;
  pointerId: number;
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  scale?: number;
  rotation?: number;
  velocity?: number;
  buttons: number;
  modifiers: { shift: boolean; ctrl: boolean; alt: boolean; meta: boolean };
}

export interface MouseMapping {
  type: 'mousemove' | 'mousedown' | 'mouseup' | 'click' | 'dblclick' | 'contextmenu' | 'wheel';
  x: number;
  y: number;
  button?: number;
  wheelX?: number;
  wheelY?: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}


