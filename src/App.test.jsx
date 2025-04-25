import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
vi.mock("axios");

import App from "./App.jsx";
import storiesReducer from "./reducers/storiesReducer.js";
import {List, Item} from './components/list/List.jsx';
import SearchForm from "./components/search-form/SearchForm.jsx";
import InputWithLabel from "./components/input-with-label/InputWithLabel.jsx";

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

describe("Item", () => {
  it("renders all properties", () => {
    render(<Item item={storyOne} />);

    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://react.dev/"
    );
  });

  it("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("clicking the dismiss button calls the callback handler", () => {
    const handleRemoveItem = vi.fn();

    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: vi.fn(),
    searchAction: vi.fn(),
  };

  it("renders the input field with its values", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });

  it("renders the correct label", () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  it("calls onSearchInput on input field change", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  it("calls searchAction on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.click(screen.getByRole("button"));

    expect(searchFormProps.searchAction).toHaveBeenCalledTimes(1);
  });
});

describe("List", () => {
  it("renders all list items", () => {
    render(<List list={stories} onRemoveItem={() => {}} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Redux")).toBeInTheDocument();
  });

  it("calls onRemoveItem when a story's dismiss button is clicked", () => {
    const handleRemoveItem = vi.fn();

    render(<List list={stories} onRemoveItem={handleRemoveItem} />);

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("InputWithLabel", () => {
  const props = {
    id: "search",
    value: "React",
    onInputChange: vi.fn(),
    isFocused: false,
    className: "input",
    labelClassName: "label",
    children: <strong>Search:</strong>,
  };

  it("renders label and input with correct attributes", () => {
    render(<InputWithLabel {...props} />);

    expect(screen.getByLabelText(/Search:/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("React")).toBeInTheDocument();
  });

  it("calls onInputChange when typing in the input", () => {
    render(<InputWithLabel {...props} />);

    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });

    expect(props.onInputChange).toHaveBeenCalledTimes(1);
  });
});

describe("App", () => {
  it("succeeds fetching data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Redux")).toBeInTheDocument();

    expect(screen.getAllByTestId("story-item").length).toBe(2);
  });

  it("fails fetching data", async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    try {
      await waitFor(() => promise);
    } catch {
      await waitFor(() => {
        expect(screen.queryByText(/Loading/)).toBeNull();
        expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
      });
    }
  });

  it("removes a story", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    await waitFor(() => promise);

    const storyItems = screen.getAllByTestId("story-item");
    expect(storyItems.length).toBe(2);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();

    const firstStoryRemoveButton = screen.getAllByTestId("remove-button")[0];
    fireEvent.click(firstStoryRemoveButton);

    expect(screen.getAllByTestId("story-item").length).toBe(1);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
  });

  it("searches for specific stories", async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: "JavaScript",
      url: "https://en.wikipedia.org/wiki/JavaScript",
      author: "Brendan Eich",
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("React")) {
        return reactPromise;
      }

      if (url.includes("JavaScript")) {
        return javascriptPromise;
      }

      throw Error();
    });

    // Initial Render
    render(<App />);

    // First Data fetching

    await waitFor(async () => await reactPromise);

    expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("JavaScript")).toBeNull();

    expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
    expect(screen.queryByText("Brendan Eich")).toBeNull();

    // User Interaction -> Search

    fireEvent.change(screen.queryByDisplayValue("React"), {
      target: {
        value: "JavaScript",
      },
    });

    expect(screen.queryByDisplayValue("React")).toBeNull();
    expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

    fireEvent.click(screen.queryByText("Submit"));

    // Second Data fetching

    await waitFor(async () => await javascriptPromise);

    expect(screen.queryByText("Jordan Walke")).toBeNull();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
  });
});
