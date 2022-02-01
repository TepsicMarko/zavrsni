import "./WindowsSearchBestMatch.css";
import { cloneElement } from "react";
import { VscSearch } from "react-icons/vsc";

const WindowsSearchBestMatch = ({
  results,
  searchIn,
  searchFor,
  openAppOrFile,
  openInBroswer,
}) => {
  const bestMatch =
    searchIn === "All"
      ? results.Apps[0] || results.Files[0] || results.Web[0]
      : results[searchIn][0];
  const handleClick = () =>
    // prettier-ignore
    searchIn === "Web"
      ? openInBroswer(searchFor)
      : bestMatch.url 
        ? openInBroswer(searchFor)
        : openAppOrFile(bestMatch.name, bestMatch.type, bestMatch.path);

  return (
    <>
      <div className='best-match-container'>
        <strong>Best match in {searchIn}</strong>
        {bestMatch ? (
          <>
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
                {bestMatch.name || searchFor}
                <div
                  className='best-match-type'
                  style={{ textTransform: !bestMatch.type ? "none" : "" }}
                >
                  {bestMatch.type || "See web results"}
                  {bestMatch.mtime && (
                    <div className='best-match-last-modified'>
                      Last modified: {bestMatch.mtime}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {searchIn !== "Web" && (
              <div className='relavant-searches'>
                {Object.keys(results).map((resultCathegoryName, j) => {
                  if (searchIn === "All" && j === 2) return null;
                  return (
                    <>
                      {results[resultCathegoryName].length
                        ? (resultCathegoryName === searchIn ||
                            searchIn === "All") && (
                            <strong>{resultCathegoryName}</strong>
                          )
                        : null}
                      {results[resultCathegoryName].map((result, i) => {
                        const openRelativeSearch = () => {
                          openAppOrFile(result.name, result.type, result.path);
                        };

                        return resultCathegoryName === searchIn && i === 0
                          ? null
                          : (resultCathegoryName === searchIn ||
                              searchIn === "All") && (
                              <div className='relavant-search'>
                                <div className='relavant-search-icon'>
                                  {cloneElement(
                                    result.icon ? result.icon : <VscSearch />,
                                    {
                                      size: "15px",
                                      width: "15px",
                                      height: "15px",
                                      color: "white",
                                    }
                                  )}
                                </div>
                                <div
                                  className='relavant-search-name'
                                  onClick={openRelativeSearch}
                                >
                                  {result.name}
                                </div>
                              </div>
                            );
                      })}
                    </>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default WindowsSearchBestMatch;
