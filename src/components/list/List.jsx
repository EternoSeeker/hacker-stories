import * as React from 'react';
import Check from "../../assets/check.svg?react";

const List = React.memo(({ list, onRemoveItem }) => (
  <ul className="story-list">
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
));

const Item = ({ item, onRemoveItem }) => (
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

export {List, Item};
