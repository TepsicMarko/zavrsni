import { useRef, useEffect, useCallback } from "react";

const useClickOutside = (onClickOutside) => {
  const elRef = useRef();
  const handleClickOutside = useCallback(
    (event) => {
      if (elRef.current && !elRef.current.contains(event.target)) {
        onClickOutside();
      }
    },
    [onClickOutside]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return elRef;
};

export default useClickOutside;
