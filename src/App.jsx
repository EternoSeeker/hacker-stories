import * as React from "react";

const useStorageState = (key, initialState) => {
  const [value, setvalue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem("value", value);
  }, [value, key]);

  return [value, setvalue];
};

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://react.dev/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [value, setvalue] = useStorageState("search", "React");

  const handleSearch = (event) => {
    setvalue(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <h2>Here's the test component</h2>
      <Search search={value} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
};

const Search = ({ onSearch, search }) => {
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
};

const Item = ({ item }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  );
};

export default App;
