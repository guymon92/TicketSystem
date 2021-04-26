import React from "react";
import { ApiClient, Ticket } from "../api";
import { SortButtonsState } from "./SortButtons";
import TicketComponent from "./TicketComponent";

export type TicketsProps = {
  fontSize: number;
  api: ApiClient;
  searchValue: string;
  sortType: SortButtonsState;
  newTicket?: Ticket;
};

export type TicketsState = {
  tickets?: Ticket[];
  numOfHiddenTickets: number;
  pageNumber: number;
  hasNextPage: boolean;
};

type TicketsAdvFilter = {
  value: string;
  date?: number;
  email?: string;
  type?: string;
};

enum SearchByTypes {
  from = "from",
  before = "before",
  after = "after",
}

export default class Tickets extends React.Component<
  TicketsProps,
  TicketsState
> {
  state: TicketsState = {
    numOfHiddenTickets: 0,
    pageNumber: 1,
    hasNextPage: true,
  };

  async componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      tickets: await this.props.api.getTickets(
        this.state.pageNumber,
        {
          name: "",
          isAscending: true,
        },
        ""
      ),
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  async componentDidUpdate(prevProps: TicketsProps) {
    if (
      prevProps.sortType &&
      this.props.sortType &&
      this.props.sortType !== prevProps.sortType
    ) {
      this.setState({
        tickets: await this.props.api.getTickets(
          this.state.pageNumber,
          this.props.sortType,
          this.props.searchValue
        ),
      });
    }
    if (this.props.newTicket && prevProps.newTicket !== this.props.newTicket) {
      this.setState({
        hasNextPage: true,
      });
    }
  }

  handleScroll = async (e: Event) => {
    const { hasNextPage, tickets, pageNumber } = this.state;
    const docElement = document.documentElement;
    if (
      hasNextPage &&
      docElement.scrollHeight - docElement.scrollTop === docElement.clientHeight
    ) {
      const newTickets: Ticket[] = await this.props.api.getTickets(
        pageNumber + 1,
        this.props.sortType,
        ""
      );
      if (this.props.sortType.name === "") {
        if (newTickets.length === 0) {
          this.setState({
            hasNextPage: false,
          });
        }
        this.setState({
          pageNumber: pageNumber + 1,
          tickets: tickets && tickets.concat(newTickets),
        });
      } else {
        if (tickets && tickets.length > newTickets.length) {
          this.setState({
            pageNumber: pageNumber + 1,
            tickets: tickets.concat(newTickets),
          });
        } else {
          this.setState({
            pageNumber: pageNumber + 1,
            tickets: newTickets,
          });
        }
      }
    }
  };

  hideTicket = (ticketId: string) => {
    const { tickets, numOfHiddenTickets } = this.state;
    const updatedTickets =
      tickets &&
      tickets.map((t: Ticket) => {
        if (t.id === ticketId) {
          t.hide = true;
        }
        return t;
      });

    this.setState({
      numOfHiddenTickets: numOfHiddenTickets + 1,
      tickets: updatedTickets,
    });
  };

  restoreItems = () => {
    const { tickets } = this.state;
    const updatedTickets =
      tickets &&
      tickets.map((t: Ticket) => {
        t.hide = false;
        return t;
      });

    this.setState({
      numOfHiddenTickets: 0,
      tickets: updatedTickets,
    });
  };

  extractAdvFromSearch = () => {
    const { searchValue } = this.props;
    const regDateAndValue: RegExp = /\s*((3[01]|[12][0-9]|0?[1-9])\/(1[012]|0?[1-9])\/((?:[1-9])\d{3}))\s*(.*)/;
    const regEmailAndValue: RegExp = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*(.*)/;
    var advFilter: TicketsAdvFilter = { value: "" };

    if (searchValue && searchValue !== "") {
      let arrSearchTyeps = searchValue.match(/\s*(from|before|after)\s*:/);
      if (arrSearchTyeps && arrSearchTyeps.length > 1) {
        const arrDateAndValue = searchValue.match(regDateAndValue);
        const arrEmailAndData = searchValue.match(regEmailAndValue);

        advFilter.type = arrSearchTyeps[1].toLowerCase();

        if (arrEmailAndData && arrEmailAndData.length === 10) {
          advFilter.email = arrEmailAndData[0].toLowerCase();
          advFilter.value = arrEmailAndData[9].toLowerCase();
        } else if (arrDateAndValue && arrDateAndValue.length === 6) {
          const strDate = arrDateAndValue[1].toLowerCase();
          const [d, m, y] = strDate.split("/");
          advFilter.date = new Date(+y, +m - 1, +d, 0, 0, 0).getTime();
          advFilter.value = arrDateAndValue[5].toLowerCase();
        }
      } else {
        advFilter.value = searchValue;
      }
    }
    return advFilter;
  };

  filterTickets = () => {
    const { tickets } = this.state;
    const advFilter: TicketsAdvFilter = this.extractAdvFromSearch();
    const filteredTickets =
      tickets &&
      tickets
        .filter((t) => {
          if (advFilter.date && advFilter.type === SearchByTypes.before) {
            return t.creationTime < advFilter.date;
          } else if (advFilter.date && advFilter.type === SearchByTypes.after) {
            return t.creationTime > advFilter.date;
          } else if (advFilter.email && advFilter.type === SearchByTypes.from) {
            return t.userEmail === advFilter.email;
          }
          return t;
        })
        .filter((t) => !t.hide)
        .filter((t) => {
          return (t.title.toLowerCase() + t.content.toLowerCase()).includes(
            advFilter.value.toLowerCase()
          );
        });

    return filteredTickets;
  };

  render() {
    const { numOfHiddenTickets, tickets } = this.state;
    const { fontSize } = this.props;
    const filteredTickets = this.filterTickets();
    return (
      <>
        {filteredTickets ? (
          <div className="results">
            Showing {filteredTickets.length} results{" "}
            {numOfHiddenTickets !== 0 ? (
              <span>
                ({numOfHiddenTickets} hidden ticket -{" "}
                <a onClick={() => this.restoreItems()}>
                  restore
                </a>
                )
              </span>
            ) : null}
          </div>
        ) : null}
        {tickets && filteredTickets ? (
          <ul className="tickets">
            {filteredTickets.map((ticket: Ticket, i: number) => (
              <TicketComponent
                key={i}
                ticket={ticket}
                hideTicket={this.hideTicket}
                fontSize={fontSize}
              />
            ))}
          </ul>
        ) : (
          <h2>Loading..</h2>
        )}
      </>
    );
  }
}
