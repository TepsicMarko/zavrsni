import './WindowsSearchBestMatch.css';
import { cloneElement } from 'react';
import { VscSearch } from 'react-icons/vsc';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { useEffect } from 'react';

const WindowsSearchBestMatch = ({
  results,
  searchIn,
  searchFor,
  openAppOrFile,
  openInBroswer,
  setFocusedResult,
  focusedResult,
}) => {
  const bestMatch =
    // prettier-ignore
    searchIn === "All"
      ? results.Apps[0] && { ...results.Apps[0], searchResultCategory: "Apps" } || 
        results.Files[0] && { ...results.Files[0], searchResultCategory: "Files"} || 
        results.Web[0] && { ...results.Web[0], searchResultCategory: "Web" }
      : results[searchIn][0];

  const handleClick = () =>
    // prettier-ignore
    searchIn === "Web"
      ? openInBroswer(searchFor)
      : bestMatch.url 
        ? openInBroswer(searchFor)
        : openAppOrFile(bestMatch.name, bestMatch.type !== "App" ? bestMatch.type: undefined, bestMatch.path);

  const focusBestMatch = (e) => {
    e.stopPropagation();
    setFocusedResult(bestMatch);
  };

  useEffect(() => {
    setFocusedResult({});
  }, [searchIn]);

  return (
    <>
      <div className='best-match-container' onClick={handleClick}>
        <strong>Best match in {searchIn}</strong>
        {bestMatch ? (
          <>
            <div className='best-match'>
              <div className='best-match-name-and-icon-hover-container'>
                <div className='best-match-icon'>
                  {cloneElement(bestMatch.icon ? bestMatch.icon : <VscSearch />, {
                    size: '30px',
                    width: '30px',
                    height: '30px',
                    color: 'white',
                  })}
                </div>
                <div className='best-match-name'>
                  {bestMatch.name || searchFor}
                  <div
                    className='best-match-type'
                    style={{ textTransform: !bestMatch.type ? 'none' : '' }}
                  >
                    {bestMatch.type || 'See web results'}
                    {bestMatch.mtime && (
                      <div className='best-match-last-modified'>
                        Last modified: {bestMatch.mtime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {Object.keys(focusedResult).length && searchIn !== 'Web' ? (
                <div className='flex-center show-more-info' onClick={focusBestMatch}>
                  <MdOutlineArrowForwardIos size='0.9rem' color='white' />
                </div>
              ) : null}
            </div>
            {searchIn !== 'Web' && (
              <div className='relavant-searches'>
                {Object.keys(results).map((resultCathegoryName, j) => {
                  if (searchIn === 'All' && j === 2) return null;
                  return (
                    <>
                      {results[resultCathegoryName].length
                        ? (resultCathegoryName === searchIn || searchIn === 'All') && (
                            <strong>{resultCathegoryName}</strong>
                          )
                        : null}
                      {results[resultCathegoryName].map((result, i) => {
                        const openRelativeSearch = (e) => {
                          e.stopPropagation();
                          openAppOrFile(
                            result.name,
                            result.type !== 'App' ? result.type : undefined,
                            result.path
                          );
                        };

                        const showMoreInfo = (e) => {
                          e.stopPropagation();
                          setFocusedResult(result);
                        };

                        return (resultCathegoryName === searchIn ||
                          bestMatch.searchResultCategory === resultCathegoryName) &&
                          i === 0
                          ? null
                          : (resultCathegoryName === searchIn || searchIn === 'All') && (
                              <div
                                className='relavant-search'
                                onClick={openRelativeSearch}
                              >
                                <div className='name-and-icon-hover-container'>
                                  <div className='flex-center relavant-search-icon'>
                                    {cloneElement(result.icon, {
                                      size: '18px',
                                      width: '18px',
                                      height: '18px',
                                      color: 'white',
                                    })}
                                  </div>
                                  <div className='relavant-search-name'>
                                    {result.name}
                                  </div>
                                </div>
                                <div
                                  className='flex-center show-more-info'
                                  onClick={showMoreInfo}
                                >
                                  <MdOutlineArrowForwardIos size='0.9rem' />
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
