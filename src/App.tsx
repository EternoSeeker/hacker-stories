import * as React from "react";
import axios from "axios";
import "./App.scss";
import { List } from "./components/list/List.tsx";
import SearchForm from "./components/search-form/SearchForm.tsx";
import storiesReducer from "./reducers/storiesReducer.ts";
import { StoryType } from "./components/list/List.tsx";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};

const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, "");

const getLastSearches = (urls: string[]) =>
  urls
    .reduce((result: string[], url: string, index: number) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length - 1];

      if (searchTerm !== previousSearchTerm) {
        return result.concat(searchTerm);
      }
      return result;
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map((url) => extractSearchTerm(url))
    .reverse();

const getUrl = (searchTerm: string) => `${API_ENDPOINT}${searchTerm}`;

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item: StoryType) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const searchAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const lastSearches = getLastSearches(urls);

  return (
    <div className="app">
      <h1 className="app__headline">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchAction={searchAction}
      />

      <div className="last-searches">
        {lastSearches.map((searchTerm: string, index: number) => (
          <button
            key={searchTerm + index}
            type="button"
            onClick={() => handleLastSearch(searchTerm)}
            className="last-searches__button"
          >
            {searchTerm}
          </button>
        ))}
      </div>

      <hr className="divider" />

      <div className="stories">
        {stories.isError && (
          <p className="stories__error">Something went wrong ...</p>
        )}

        {stories.isLoading ? (
          <p className="stories__loading">Loading .</p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory} />
        )}
      </div>
    </div>
  );
};

export default App;
