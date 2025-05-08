import { useState, useEffect, useCallback, useReducer } from "react";
import axios from "axios";

import "./App.scss";

import { List } from "./components/list/List.tsx";
import SearchForm from "./components/search-form/SearchForm.tsx";
import LastSearches from "./components/last-searches/LastSearches.tsx";
import storiesReducer from "./reducers/storiesReducer.ts";

//hooks
import useStorageState from "./hooks/useStorageState.ts";
import useInfiniteScroll from "./hooks/useInfiniteScroll.ts";

//types
import { StoryType } from "./components/list/List.tsx";

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm: string, page: number) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = (url: string) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAM_SEARCH, "");

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
    .reverse();

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item: StoryType) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const searchAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm, 0);
  };

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const lastSearches = getLastSearches(urls);

  const handleMore = useCallback(() => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  }, [stories.page, urls]);

  const bottomRef = useInfiniteScroll(handleMore, stories.isLoading);

  return (
    <div className="app">
      <h1 className="app__headline">Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchAction={searchAction}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />

      <hr className="divider" />

      <div className="stories">
        {stories.isError && (
          <p className="stories__error">Something went wrong ...</p>
        )}

        <List list={stories.data} onRemoveItem={handleRemoveStory} />

        {stories.isLoading && <p className="stories__loading">Loading .</p>}

        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
};

export default App;
