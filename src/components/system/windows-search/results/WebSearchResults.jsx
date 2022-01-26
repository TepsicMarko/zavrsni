import "./SearchResults.css";

const WebSearchResults = ({}) => {
  const results = [
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit consectetur adipisicing",
      url: "https://somelongurnaexamplename.com",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit itaque amet nulla sequi architecto enim hic illo perspiciatis libero sunt non explicabo est eos optio commodi, quae at?",
    },
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit consectetur adipisicing",
      url: "https://somelongurnaexamplename.com",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit itaque amet nulla sequi architecto enim hic illo perspiciatis libero sunt non explicabo est eos optio commodi, quae at?",
    },
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit consectetur adipisicing",
      url: "https://somelongurnaexamplename.com",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit itaque amet nulla sequi architecto enim hic illo perspiciatis libero sunt non explicabo est eos optio commodi, quae at?",
    },
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit consectetur adipisicing",
      url: "https://somelongurnaexamplename.com",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt quos suscipit itaque amet nulla sequi architecto enim hic illo perspiciatis libero sunt non explicabo est eos optio commodi, quae at?",
    },
  ];
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
