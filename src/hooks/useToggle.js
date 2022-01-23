import { useState } from "react";

const useToggle = (initialValue) => {
  const [state, setState] = useState(initialValue || false);
  const toggle = () => {
    setState(!state);
  };
  const setToggleState = (newState) => {
    setState(newState);
  };

  return [state, toggle, setToggleState];
};

export default useToggle;
