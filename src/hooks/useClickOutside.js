import { useRef, useEffect } from "react";

const useClickOutside = (onClickOutside) => {
  const elRef = useRef();
  const handleClickOutside = (event) => {
    if (elRef.current && !elRef.current.contains(event.target)) {
      onClickOutside();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return elRef;
};

export default useClickOutside;
