import "./WindowsSearchBestMatch.css";
import { cloneElement } from "react";

const WindowsSearchBestMatch = ({ bestMatch, searchIn, openAppOrFile }) => {
  const handleClick = () =>
    openAppOrFile(bestMatch.name, bestMatch.type, bestMatch.path);

  return (
    <div className='best-match-container'>
      <strong>Best match in {searchIn}</strong>
      {bestMatch ? (
        <div className='best-match' onClick={handleClick}>
          <div className='best-match-icon'>
            {cloneElement(bestMatch.icon, {
              size: "30px",
              width: "30px",
              height: "30px",
              color: "white",
            })}
          </div>
          <div className='best-match-name'>
            {bestMatch.name}
            <div className='best-match-type'>
              {bestMatch.type}
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
