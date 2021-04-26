import React from "react";
import "react-inputs-validation/lib/react-inputs-validation.min.css";
import "./App.scss";
import { createApiClient, Ticket } from "./api";
import FontSize from "./components/FontSize";
import SortButtons, { SortButtonsState } from "./components/SortButtons";
import Tickets from "./components/Tickets";
import NewTicket from "./components/NewTicket";

export type AppState = {
  search: string;
  fontSize: number;
  sortType: SortButtonsState;
  hasNewTicket: boolean;
  newTicket?: Ticket;
};

const api = createApiClient();

export default class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    search: "",
    fontSize: 16,
    sortType: { name: "", isAscending: true },
    hasNewTicket: false,
  };

  searchDebounce: any = null;

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        search: val,
      });
    }, 300);
  };

  handleSizeChange = (newSize: number) => {
    this.setState({
      fontSize: newSize,
    });
  };

  handleSortBy = (newSort: SortButtonsState) => {
    this.setState({
      sortType: newSort,
    });
  };

  addNewTicket = () => {
    !this.state.hasNewTicket
      ? this.setState({
          hasNewTicket: true,
        })
      : this.setState({
          hasNewTicket: false,
        });
  };

  handlSubmitNewTicket = async (newTicket: Ticket) => {
    if (newTicket) {
      this.setState({
        hasNewTicket: false,
        newTicket: newTicket,
      });

      await api.postTicket(newTicket);
    }
  };

  render() {
    const { fontSize, search, sortType, hasNewTicket, newTicket } = this.state;

    return (
      <main>
        <FontSize onSelectSize={this.handleSizeChange} />
        <h1>Tickets List</h1>
        <header>
          <input
            type="search"
            placeholder="Search..."
            onChange={(e) => this.onSearch(e.target.value)}
          />
        </header>
        <SortButtons onSortBy={this.handleSortBy} />
        <button
          onClick={this.addNewTicket}
          style={{ marginBottom: 14 }}
          className={hasNewTicket ? "on" : ""}
        >
          Add Ticket
        </button>
        {hasNewTicket ? (
          <NewTicket handleSubmit={this.handlSubmitNewTicket} />
        ) : null}
        <Tickets
          fontSize={fontSize}
          api={api}
          searchValue={search}
          sortType={sortType}
          newTicket={newTicket}
        />
      </main>
    );
  }
}
