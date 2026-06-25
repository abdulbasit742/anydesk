import { useState } from 'react';

export function usePrevious(value) {
  const [state, setState] = useState({
    current: value,
    previous: undefined,
  });

  if (value !== state.current) {
    setState({
      current: value,
      previous: state.current,
    });
  }

  return state.previous;
}
