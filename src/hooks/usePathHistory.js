import { useState, useCallback } from "react";

const usePathHistory = (initialPath, allowEmptyString) => {
  const [previous, setPrevious] = useState([]);
  const [current, setCurrent] = useState(initialPath);
  const [next, setNext] = useState([]);

  const goBack = useCallback(() => {
    setNext([...next, current]);
    setCurrent(previous[previous.length - 1]);
    setPrevious(previous.filter((el, i) => i !== previous.length - 1));
  }, [previous, current, next]);

  const goForth = useCallback(() => {
    setPrevious([...previous, current]);
    setCurrent(next[next.length - 1]);
    setNext(next.filter((el, i) => i !== next.length - 1));
  }, [previous, current, next]);

  const watchPath = useCallback(
    (path) => {
      current !== path && setPrevious([...previous, current]);
      current && setCurrent(path);
      allowEmptyString && setCurrent(path);
    },
    [previous, current]
  );

  return [previous, goBack, current, goForth, next, watchPath];
};

export default usePathHistory;
