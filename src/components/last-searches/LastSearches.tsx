type LastSearchesProps = {
  lastSearches: string[];
  onLastSearch: (searchTerm: string) => void;
};

const LastSearches = ({ lastSearches, onLastSearch }: LastSearchesProps) => {
  return (
    <div className="last-searches">
      {lastSearches.map((searchTerm: string, index: number) => (
        <button
          key={searchTerm + index}
          type="button"
          onClick={() => onLastSearch(searchTerm)}
          className="last-searches__button"
        >
          {searchTerm}
        </button>
      ))}
    </div>
  );
};

export default LastSearches;