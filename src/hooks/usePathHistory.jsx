import { useState, useEffect, useCallback } from "react";
import { path as Path } from "filer";

const usePathHistory = (initialPath, setPath) => {
  const [previous, setPrevious] = useState([]);
  const [current, setCurrent] = useState(initialPath);
  const [next, setNext] = useState([]);

  const goBack = () => {
    setNext([...next, current]);
    setCurrent(previous[previous.length - 1]);
    setPrevious(previous.filter((el, i) => i !== previous.length - 1));
  };

  const goForth = () => {
    setPrevious([...previous, current]);
    setCurrent(next[next.length - 1]);
    setNext(next.filter((el, i) => i !== next.length - 1));
  };

  const watchPath = (path) => {
    current !== path && setPrevious([...previous, current]);
    current && setCurrent(path);
  };

  return [previous, goBack, current, goForth, next, watchPath];
};

export default usePathHistory;
