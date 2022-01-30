import "./SearchResults.css";
import { FaChrome } from "react-icons/fa";
import moment from "moment";

const WebSearchResults = ({ results, openInBroswer }) => {
  return (
    <div
      className='web-search-results'
      style={{ overflow: !results.length ? "hidden" : "" }}
    >
      {results.length ? (
        <>
          {results.map(({ title, url, description }) => {
            const handleClick = () => openInBroswer(url.raw);

            return (
              <div className='web-search-result'>
                <div className='result-title' onClick={handleClick}>
                  {title}
                </div>
                <div
                  className='result-url'
                  dangerouslySetInnerHTML={{ __html: url.htmlFormattedUrl }}
                  onClick={handleClick}
                ></div>
                <div className='result-description'>{description}</div>
              </div>
            );
          })}
          <div className='flex-center microsoft-copyright'>
            © {moment().format("yyyy")} Microsoft
          </div>

          <button
            className='flex-center open-in-browser'
            onClick={openInBroswer}
          >
            <FaChrome size='1rem' />
            Open result in browser
          </button>
        </>
      ) : (
        Array.from({ length: 10 }).map((el) => (
          <div className='web-search-result-skeleton'>
            <div className='skeleton-animation'></div>
            <div className='skeleton-title'></div>
            <div className='skeleton-url'></div>
            <div className='skeleton-description'>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WebSearchResults;
