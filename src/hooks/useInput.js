import { useState } from "react";

const useInput = (initialValue) => {
  const [state, setState] = useState(initialValue || "");
  const handleInputChange = (e) => setState(e.target.value);
  return [state, handleInputChange];
};

export default useInput;
