import "./SearchResults.css";
import { FaChrome } from "react-icons/fa";
import moment from "moment";

const WebSearchResults = ({ results, openInBroswer }) => {
  return (
    <div className='web-search-results'>
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

      <button className='flex-center open-in-browser' onClick={openInBroswer}>
        <FaChrome size='1rem' />
        Open result in browser
      </button>
    </div>
  );
};

export default WebSearchResults;
