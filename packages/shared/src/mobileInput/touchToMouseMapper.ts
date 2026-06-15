import { TouchEventPayload, MouseMapping } from './gestureTypes.js';

export function mapTouchToMouse(t: TouchEventPayload): MouseMapping[] {
  const mods = {
    ctrlKey: t.modifiers.ctrl,
    shiftKey: t.modifiers.shift,
    altKey: t.modifiers.alt,
    metaKey: t.modifiers.meta,
  };
  switch (t.action) {
    case 'move':
      return [{ type: 'mousemove', x: t.x, y: t.y, ...mods }];
    case 'tap':
      return [
        { type: 'mousedown', x: t.x, y: t.y, button: 0, ...mods },
        { type: 'mouseup', x: t.x, y: t.y, button: 0, ...mods },
        { type: 'click', x: t.x, y: t.y, button: 0, ...mods },
      ];
    case 'double_tap':
      return [{ type: 'dblclick', x: t.x, y: t.y, button: 0, ...mods }];
    case 'long_press':
      return [{ type: 'contextmenu', x: t.x, y: t.y, button: 2, ...mods }];
    case 'scroll':
      return [{ type: 'wheel', x: t.x, y: t.y, wheelX: (t.dx ?? 0) * 3, wheelY: (t.dy ?? 0) * 3, ...mods }];
    default:
      return [];
  }
}


