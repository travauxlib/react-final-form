import { useEffect, useRef, useState } from "react";

const useEffectOnceInStrictMode: typeof useEffect = (effect, deps) => {
  const destroyFn = useRef();
  const effectCalled = useRef(null);
  const rendered = useRef(false);

  if (effectCalled.current) {
    if (effectCalled.current.every((el, i) => deps[i] === el)) {
      rendered.current = true;
    } else {
      effectCalled.current = null;
    }
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFn.current = effect();
      effectCalled.current = deps;
    }

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!rendered.current) {
        return;
      }

      // otherwise this is not a dummy destroy, so call the destroy func
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, deps);
};

export default useEffectOnceInStrictMode;
