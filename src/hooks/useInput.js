import { useState } from "react";

const useInput = (initialValue) => {
  const [state, setState] = useState(initialValue || "");
  const handleInputChange = (e) =>
    setState(e.target.value || e.target.textContent);
  return [state, handleInputChange];
};

export default useInput;
