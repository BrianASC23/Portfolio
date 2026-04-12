'use client';

import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

export function useNewYorkTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(formatter.format(new Date()));
    const id = setInterval(() => setTime(formatter.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
