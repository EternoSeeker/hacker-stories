import InputWithLabel from "../input-with-label/InputWithLabel.jsx";

const SearchForm = ({ searchTerm, onSearchInput, searchAction }) => {
  return (
    <form onSubmit={searchAction} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
        className="search-form__input"
        labelClassName="search-form__label"
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!searchTerm}
        className="button button--large"
      >
        Submit
      </button>
    </form>
  );
};

export default SearchForm;
