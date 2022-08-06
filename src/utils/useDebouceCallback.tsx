// Don't need react-use or any other dep just for 1 hook.
// Thanks to this: https://stackoverflow.com/questions/56283920/how-to-debounce-a-callback-in-functional-component-using-hooks

import { DependencyList, useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback<A extends any[]>(
  callback: (...args: A) => void,
  wait: number,
  deps: DependencyList[]
) {
  // track args & timeout handle between calls
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, []);

  return useCallback(function debouncedCallback(...args: A) {
    // capture latest args
    argsRef.current = args;

    // clear debounce timer
    cleanup();

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  }, deps);
}
