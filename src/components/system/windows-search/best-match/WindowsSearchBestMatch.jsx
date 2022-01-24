import "./WindowsSearchBestMatch.css";

const WindowsSearchBestMatch = ({ bestMatch, searchIn }) => {
  return (
    <div className='best-match-container'>
      <strong>Best match in {searchIn}</strong>
      <div className='best-match'>{bestMatch}</div>
    </div>
  );
};

export default WindowsSearchBestMatch;
