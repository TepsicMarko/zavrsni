import "./Chrome.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import ChromeNavbar from "./navbar/ChromeNavbar";
import usePathHistory from "../../../hooks/usePathHistory";
import { useState, useEffect } from "react";

const Chrome = ({ icon }) => {
  const [url, setUrl] = useState("");
  const [previous, goBack, current, goForth, next, watchPath] = usePathHistory(
    url,
    true
  );

  const handlePageLoad = (e) => {
    e.contentWindow && console.log(e.contentWindow.location);
  };

  useEffect(() => {
    watchPath(url);
  }, [url]);

  useEffect(() => {
    url !== current && setUrl(current);
  }, [current]);

  return (
    <Window
      app='Chrome'
      icon={icon}
      minWindowWidth='15rem'
      minWindowHeight='5rem'
      titleBar={{ color: "white", backgroundColor: "#202124" }}
    >
      <WindowContent flex flexDirection='column'>
        <ChromeNavbar
          previous={previous.length}
          goBack={goBack}
          url={url}
          setUrl={setUrl}
          goForth={goForth}
          next={next.length}
        />
        <iframe
          className='google'
          referrerpolicy='no-referrer'
          sandbox='allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts'
          src='https://www.google.com'
          onLoad={handlePageLoad}
        ></iframe>
      </WindowContent>
    </Window>
  );
};

export default Chrome;
