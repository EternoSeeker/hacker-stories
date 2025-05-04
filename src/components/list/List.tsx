import * as React from "react";
import Check from "../../assets/check.svg?react";
import "./List.scss";
import { sortBy } from "lodash";

type StoryType = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type ItemProps = {
  item: StoryType;
  onRemoveItem: (item: StoryType) => void;
};

type ListProps = {
  list: StoryType[];
  onRemoveItem: (item: StoryType) => void;
};

type SortKeyType = "NONE" | "TITLE" | "AUTHOR" | "COMMENTS" | "POINTS";

const SORTS: Record<SortKeyType, (list: StoryType[]) => StoryType[]> = {
  NONE: (list: StoryType[]) => list,
  TITLE: (list: StoryType[]) => sortBy(list, "title"),
  AUTHOR: (list: StoryType[]) => sortBy(list, "author"),
  COMMENTS: (list: StoryType[]) => sortBy(list, "num_comments").reverse(),
  POINTS: (list: StoryType[]) => sortBy(list, "points").reverse(),
};

const List = React.memo(({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState<SortKeyType>("NONE");

  const handleSort = (sortKey: SortKeyType) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  const currentActiveSort = (headerName: string) => {
    return sort === headerName ? "header--current" : "";
  };

  return (
    <ul className="story-list">
      <li className="story-headers">
        <span className="story-headers--title">
          <button
            className={`button--header ${currentActiveSort("TITLE")}`}
            type="button"
            onClick={() => handleSort("TITLE")}
          >
            Title
          </button>
        </span>
        <span className="story-headers--author">
          <button
            className={`button--header ${currentActiveSort("AUTHOR")}`}
            type="button"
            onClick={() => handleSort("AUTHOR")}
          >
            Author
          </button>
        </span>
        <span className="story-headers--comments">
          <button
            className={`button--header ${currentActiveSort("COMMENTS")}`}
            type="button"
            onClick={() => handleSort("COMMENTS")}
          >
            Comments
          </button>
        </span>
        <span className="story-headers--points">
          <button
            className={`button--header ${currentActiveSort("POINTS")}`}
            type="button"
            onClick={() => handleSort("POINTS")}
          >
            Points
          </button>
        </span>
        <span className="story-headers--actions"></span>
      </li>

      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
});

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <li className="story" data-testid="story-item">
    <span className="story__column story__column--title">
      <a href={item.url} className="story__link">
        {item.title}
      </a>
    </span>
    <span className="story__column story__column--author">{item.author}</span>
    <span className="story__column story__column--comments">
      {item.num_comments}
    </span>
    <span className="story__column story__column--points">{item.points}</span>
    <span className="story__column story__column--actions">
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className="button button--small"
        data-testid="remove-button"
      >
        <Check height="18px" width="18px" />
      </button>
    </span>
  </li>
);

export { List, Item };
export type { StoryType };
