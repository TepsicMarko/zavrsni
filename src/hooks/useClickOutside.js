import { useRef, useEffect } from "react";

const useClickOutside = (targetEvent, handleEvent) => {
  const elRef = useRef();
  const handleClickOutside = (event) => {
    if (elRef.current && !elRef.current.contains(event.target)) {
      handleEvent();
    }
  };

  useEffect(() => {
    document.addEventListener(targetEvent, handleClickOutside);
    return () => {
      document.removeEventListener(targetEvent, handleClickOutside);
    };
  }, [handleClickOutside]);

  return elRef;
};

export default useClickOutside;
