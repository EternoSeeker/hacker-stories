import { describe, it, expect } from "vitest";

import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from "./App.jsx";

const storyOne = {
  title: "React",
  url: "https://react.dev/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  it("removes a story from all stories", () => {
    const action = { type: "REMOVE_STORY", payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("start fetching stories", () => {
    const action = { type: "STORIES_FETCH_INIT" };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories,
      isLoading: true,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("successfully fetch the stories", () => {
    const newStories = stories;
    const action = { type: "STORIES_FETCH_SUCCESS", payload: newStories };
    const state = { data: [], isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: newStories,
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });

  it("failed to fetch the stories", () => {
    const action = { type: "STORIES_FETCH_FAILURE" };
    const state = { data: [], isLoading: true, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [],
      isLoading: false,
      isError: true,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe("App component", () => {
  it("removes an item when clicking the Dismiss button", () => {});

  it("requests some initial stories from an API", () => {});
});
