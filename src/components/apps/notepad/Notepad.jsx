import "./Notepad.css";
import Window from "../../system/window/Window";
import WindowContent from "../../system/window/window-content/WindowContent";
import StatusBar from "../../system/window/status-bar/StatusBar";
import { WindowWidthProvider } from "../../../contexts/WindowWidthContext";
import NotepadNavbar from "./navbar/NotepadNavbar";
import { useState, memo, useEffect, useContext, useRef } from "react";
import { FileSystemContext } from "../../../contexts/FileSystemContext";

const Notepad = ({ icon, filePath }) => {
  const [text, setText] = useState({ content: "", lines: 1 });
  const { readFileContent } = useContext(FileSystemContext);
  const divRef = useRef(null);

  const handleChange = (e) => {
    setText({
      content: e.target.textContent,
      lines: (e.target.innerHTML.match(/<div>/g) || "").length + 1,
    });
  };

  const focusTextContent = (e) => {
    e.target.firstChild.focus();
  };

  const stopPropagation = (e) => e.stopPropagation();
  const setTextContent = (content) => {
    setText({
      content,
      lines: (`${content}`.match(/<div>/g) || "").length + 1,
    });
    divRef.current.innerHTML = content;
  };

  useEffect(() => {
    filePath && readFileContent(filePath, setTextContent);
  }, [filePath]);

  return (
    <WindowWidthProvider>
      <Window
        app='Notepad'
        icon={icon}
        minWindowWidth='9rem'
        minWindowHeight='8.2rem'
        titleBar={{ color: "black", backgroundColor: "white" }}
      >
        <WindowContent
          backgroundColor='white'
          flex
          flexDirection='column'
          flexWrap='wrap'
        >
          <NotepadNavbar textContent={text.content} filePath={filePath} />
          <div
            className='notepad-text-content-container'
            onClick={focusTextContent}
          >
            <div
              ref={divRef}
              className='notepad-text-content'
              contentEditable
              suppressContentEditableWarning
              onInput={handleChange}
              onClick={stopPropagation}
            ></div>
          </div>
        </WindowContent>
        <StatusBar
          backgroundColor='#f1f1f1'
          color='black'
          flex
          borderColor='#DBDBDB'
          borderStyle='solid'
          borderWidth='1px 0 0 0'
          fontWeight='400'
          position='relative'
        >
          <div className='line-count'>Ln {text.lines}, </div>
          <div className='word-count'>Col {text.content.length}</div>
          <div className='font-size'>100%</div>
          <div className='clrf'>Windows(CRLF)</div>
          <div className='file-format'>UTF-8</div>
        </StatusBar>
      </Window>
    </WindowWidthProvider>
  );
};

export default memo(Notepad);
