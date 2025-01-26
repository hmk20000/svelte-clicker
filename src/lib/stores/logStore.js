import { writable } from 'svelte/store';

function createLogStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    addLog: (message) => update(logs => {
      const newLogs = [...logs, { message, timestamp: new Date() }];
      // 최대 100개의 로그만 유지
      if (newLogs.length > 100) newLogs.shift();
      return newLogs;
    }),
    clear: () => update(() => [])
  };
}

export const logStore = createLogStore(); 