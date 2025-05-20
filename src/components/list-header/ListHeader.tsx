// import Type
import { SortKey } from "../list/List.tsx";

interface ListHeaderProps {
  headerName: SortKey;
  activeSortKey: SortKey;
  isReverse: boolean;
  onSort: (sortKey: SortKey) => void;
  children: React.ReactNode;
}

const ListHeader = ({
  headerName,
  activeSortKey,
  isReverse,
  onSort,
  children,
}: ListHeaderProps) => {
  const isActive = headerName === activeSortKey;
  const headerClass = isActive ? "header--current" : null;
  const getSortDirection = isReverse ? "arrow_drop_down" : "arrow_drop_up";

  return (
    <div className={`story-header story-headers--${headerName.toLowerCase()}`}>
      <div className="header-content">
        <button
          className={`button--header ${headerClass}`}
          type="button"
          onClick={() => onSort(headerName)}
        >
          {children}
        </button>
        {isActive && (
          <span className="material-symbols-outlined sort-icon">
            {getSortDirection}
          </span>
        )}
      </div>
    </div>
  );
};

export default ListHeader;
