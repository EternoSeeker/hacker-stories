import InputWithLabel from "../input-with-label/InputWithLabel.tsx";
import "./SearchForm.scss";

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchAction: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm = ({ searchTerm, onSearchInput, onSearchAction }: SearchFormProps) => {
  return (
    <form onSubmit={onSearchAction} className="search-form">
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
        <span className="material-symbols-outlined">search</span>
      </button>
    </form>
  );
};

export default SearchForm;
