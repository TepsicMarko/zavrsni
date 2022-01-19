import { useState, useEffect } from "react";

const ShutdownOutput = ({ time }) => {
  const [FinalCountdown, setFinalCountdown] = useState(time); //this is a refrence to https://www.youtube.com/watch?v=9jK-NcRmVcw

  useEffect(() => {
    if (!time) window.location.reload();

    if (FinalCountdown !== 0)
      setTimeout(() => setFinalCountdown(FinalCountdown - 100), 100);
    else window.location.reload();
  }, [FinalCountdown]);

  return (
    <div>
      {time !== NaN
        ? `Shutting down in ${FinalCountdown / 1000 || 0} seconds`
        : "The syntax of the command is incorrect."}
    </div>
  );
};

export default ShutdownOutput;
