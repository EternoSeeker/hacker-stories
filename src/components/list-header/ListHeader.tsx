import { SortKeyType } from "../list/List.tsx";

type ListHeaderProps = {
  sortKey: SortKeyType;
  activeSortKey: SortKeyType;
  isReverse: boolean;
  onSort: (sortKey: SortKeyType) => void;
  children: React.ReactNode;
};


const ListHeader = ({
  sortKey,
  activeSortKey,
  isReverse,
  onSort,
  children,
}: ListHeaderProps) => {
  const isActive = sortKey === activeSortKey;
  const headerClass = isActive ? "header--current" : null;

  const getSortDirection = () => {
    if (!isActive) return null;
    return isReverse ? "arrow_drop_down" : "arrow_drop_up";
  };

  return (
    <div className="header-content">
      <button
        className={`button--header ${headerClass}`}
        type="button"
        onClick={() => onSort(sortKey)}
      >
        {children}
      </button>
      {getSortDirection() && (
        <span className="material-symbols-outlined sort-icon">
          {getSortDirection()}
        </span>
      )}
    </div>
  );
};

export default ListHeader;
