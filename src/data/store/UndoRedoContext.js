// UndoRedoContext.js — Multi-step undo/redo across board shifts and flowchart mutations
import { createContext, useContext, useReducer, useCallback } from 'react';

const MAX_HISTORY = 50;

const UndoRedoContext = createContext(null);

function historyReducer(state, action) {
  switch (action.type) {
    case 'PUSH': {
      const past = [...state.past, state.present].slice(-MAX_HISTORY);
      return { past, present: action.payload, future: [] };
    }
    case 'UNDO': {
      if (!state.past.length) return state;
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case 'RESET':
      return { past: [], present: action.payload, future: [] };
    default:
      return state;
  }
}

export function UndoRedoProvider({ children, initialState }) {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const push = useCallback(newState => dispatch({ type: 'PUSH', payload: newState }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const reset = useCallback(s => dispatch({ type: 'RESET', payload: s }), []);

  return (
    <UndoRedoContext.Provider value={{
      state: history.present,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      push, undo, redo, reset,
    }}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedo() {
  const ctx = useContext(UndoRedoContext);
  if (!ctx) throw new Error('useUndoRedo must be used within UndoRedoProvider');
  return ctx;
}
