import * as React from "react";
import Check from "../../assets/check.svg?react";
import ListHeader from "../list-header/ListHeader.tsx";
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

type SortKeyType = "None" | "Title" | "Author" | "Comments" | "Points";

type SortStateType = {
  sortKey: SortKeyType;
  isReverse: boolean;
};

const SORTS: Record<SortKeyType, (list: StoryType[]) => StoryType[]> = {
  None: (list: StoryType[]) => list,
  Title: (list: StoryType[]) => sortBy(list, "title"),
  Author: (list: StoryType[]) => sortBy(list, "author"),
  Comments: (list: StoryType[]) => sortBy(list, "num_comments"),
  Points: (list: StoryType[]) => sortBy(list, "points"),
};

const List = React.memo(({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState<SortStateType>({
    sortKey: "None",
    isReverse: false,
  });

  const handleSort = (sortKey: SortKeyType) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  return (
    <ul className="story-list">
      <li className="story-headers">
        {Object.keys(SORTS)
          .slice(1)
          .map((headerName) => (
            <ListHeader
              key={headerName}
              headerName={headerName as SortKeyType}
              activeSortKey={sort.sortKey}
              isReverse={sort.isReverse}
              onSort={handleSort}
            >
              {headerName}
            </ListHeader>
          ))}
        <div className="story-header story-headers--actions"></div>
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
export type { StoryType, SortKeyType };
