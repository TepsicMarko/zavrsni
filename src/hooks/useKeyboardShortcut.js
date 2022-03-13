import { useState, useEffect } from 'react';

const useKeyboardShortcut = ([base, key], initilaShortcutHandler) => {
  const [shortcutHandler, setShortcutHandler] = useState(() => initilaShortcutHandler);

  const eventHandler = (e) => {
    if (base && key) {
      if (e[base + 'Key'] && e.key === key) shortcutHandler && shortcutHandler();
    }

    if (base && !key) {
      if (e.key.toLowerCase() === base) shortcutHandler && shortcutHandler();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', eventHandler);

    return () => document.removeEventListener('keydown', eventHandler);
  }, [shortcutHandler]);

  return (newFunction) => setShortcutHandler(() => newFunction);
};

export default useKeyboardShortcut;
