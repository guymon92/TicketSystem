import React from "react";
import "../App.scss";

export type SortButtonsState = {
  name: string;
  isAscending: boolean;
};

export enum SortType {
  ByDate = "Sort by date",
  ByTitle = "Sort by title",
  ByEmail = "Sort by email",
}

export default class SortButtons extends React.Component<
  { onSortBy: Function },
  SortButtonsState
> {
  state: SortButtonsState = {
    name: "",
    isAscending: true,
  };

  sortBy = (sortBy: SortButtonsState) => {
    if (sortBy.name === this.state.name) {
      this.props.onSortBy({
        name: sortBy.name,
        isAscending: !this.state.isAscending,
      });
      this.setState({
        isAscending: !this.state.isAscending,
      });
    } else {
      this.setState({
        ...sortBy,
      });
      this.props.onSortBy(sortBy);
    }
  };

  render() {
    const arrSortTypes: SortButtonsState[] = [
      { name: SortType.ByDate, isAscending: true },
      { name: SortType.ByTitle, isAscending: true },
      { name: SortType.ByEmail, isAscending: true },
    ];

    return (
      <div className="sort">
        {arrSortTypes.map((sort, i) => {
          return (
            <button
              key={i}
              className={this.state.name === sort.name ? "on" : ""}
              onClick={() => {
                this.sortBy(sort);
              }}
            >
              {sort.name}
            </button>
          );
        })}
      </div>
    );
  }
}
