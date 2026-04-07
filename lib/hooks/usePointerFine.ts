'use client';

import { useEffect, useState } from 'react';

export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    const update = () => setFine(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return fine;
}
