import "./ChromeNavbar.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { GrRefresh } from "react-icons/gr";
import { useState, useEffect } from "react";

const ChromeNavbar = ({ previous, goBack, url, setUrl, goForth, next }) => {
  const [input, setInput] = useState(url);
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setUrl(e.target.value);
    }
  };

  useEffect(() => {
    setInput(url);
  }, [url]);

  return (
    <div className='chrome-navbar'>
      <div className='chrome-nav-buttons'>
        <div
          className={
            "flex-center" + (previous ? " chrome-nav-hover-effect" : "")
          }
        >
          <MdArrowBack
            color={previous ? "white" : "#7D7F81"}
            onClick={goBack}
          />
        </div>
        <div
          className={"flex-center" + (next ? " chrome-nav-hover-effect" : "")}
        >
          <MdArrowForward
            color={next ? "white" : "#7D7F81"}
            onClick={goForth}
          />
        </div>
        <div className='flex-center chrome-nav-hover-effect'>
          <GrRefresh size='0.8rem' />
        </div>
      </div>
      <input
        type='url'
        className='chrome-address-bar'
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChromeNavbar;
