import "./WindowsSearchBestMatch.css";
import { cloneElement } from "react";
import { VscSearch } from "react-icons/vsc";

const WindowsSearchBestMatch = ({ bestMatch, searchIn, openAppOrFile }) => {
  const handleClick = () =>
    openAppOrFile(bestMatch.name, bestMatch.type, bestMatch.path);

  return (
    <div className='best-match-container'>
      <strong>Best match in {searchIn}</strong>
      {bestMatch ? (
        <div className='best-match' onClick={handleClick}>
          <div className='best-match-icon'>
            {cloneElement(bestMatch.icon ? bestMatch.icon : <VscSearch />, {
              size: "30px",
              width: "30px",
              height: "30px",
              color: "white",
            })}
          </div>
          <div className='best-match-name'>
            {bestMatch.name || bestMatch.query}
            <div className='best-match-type'>
              {bestMatch.type || "see web results"}
              {searchIn === "Files" && (
                <div className='best-match-last-modified'>
                  Last modified: {bestMatch.mtime}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WindowsSearchBestMatch;
