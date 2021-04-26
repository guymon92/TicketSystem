import React from "react";
import { Ticket } from "../api";

export type TicketComponentProps = {
  ticket: Ticket;
  hideTicket: (id: string) => void;
  fontSize: number;
};

export default class TicketComponent extends React.Component<TicketComponentProps> {
  state = {
    showLess: false,
  };

  changeShowLess = () => {
    const { showLess } = this.state;
    this.setState({
      showLess: !showLess,
    });
  };

  render() {
    const { ticket, hideTicket, fontSize } = this.props;
    const { showLess } = this.state;

    return (
      <li key={ticket.id} className="ticket">
        <a className="hideBtn" onClick={() => hideTicket(ticket.id)}>
          Hide
        </a>
        <h5 className="title">{ticket.title}</h5>
        <p
          style={{ fontSize }}
          className={showLess ? "content less" : "content more"}
        >
          {ticket.content}
        </p>
        <a onClick={this.changeShowLess}>
          {showLess ? "See more" : "See less"}
        </a>
        <footer>
          <div className="meta-data">
            By {ticket.userEmail} |{" "}
            {new Date(ticket.creationTime).toLocaleString()}
          </div>
        </footer>
      </li>
    );
  }
}
