import "./SearchResults.css";

const WebSearchResults = ({ results }) => {
  return (
    <div className='web-search-results'>
      {results.map(({ title, url, description }) => (
        <div className='web-search-result'>
          <div className='result-title'>{title}</div>
          <div className='result-url'>{url}</div>
          <div className='result-description'>{description}</div>
        </div>
      ))}
    </div>
  );
};

export default WebSearchResults;
