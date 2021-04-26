import React from "react";
import { Ticket } from "../api";
import { Textbox, Textarea } from "react-inputs-validation";

export type NewTicketState = {
  title: string;
  content: string;
  email: string;
  isTitleValid: boolean;
  isContentValid: boolean;
  isEmailValid: boolean;
};

export default class NewTicket extends React.Component<
  {
    handleSubmit: Function;
  },
  NewTicketState
> {
  state: NewTicketState = {
    title: "",
    content: "",
    email: "",
    isTitleValid: false,
    isContentValid: false,
    isEmailValid: false,
  };

  searchDebounce: any = null;

  onTitleChange = async (val: string) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        title: val,
      });
    }, 300);
  };

  onEmailChange = async (val: string) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        email: val,
      });
    }, 300);
  };

  onContentChange = async (val: string) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        content: val,
      });
    }, 300);
  };

  validateInput = (): boolean => {
    const { isTitleValid, isEmailValid, isContentValid } = this.state;
    if (isTitleValid && isEmailValid && isContentValid) return true;
    return false;
  };

  onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, email, content } = this.state;
    const validInput = this.validateInput();
    if (validInput) {
      const newTicket: Ticket = {
        id: "",
        title: title,
        content: content,
        userEmail: email,
        creationTime: new Date().getTime(),
      };
      this.props.handleSubmit(newTicket);
    }
  };

  render() {
    return (
      <div className="tickets">
        <form onSubmit={this.onFormSubmit} className="ticket">
          <h1>New Ticket</h1>
          <Textbox
            attributesInput={{
              id: "title",
              name: "title",
              type: "text",
              placeholder: "Title",
            }}
            onChange={(title: string, e: any) => {
              this.setState({ title });
            }}
            onBlur={() => {}}
            validationOption={{
              name: "title",
              check: true,
              required: true,
              customFunc: (title: string) => {
                if (title.length > 10) {
                  this.setState({ isTitleValid: true });
                  return true;
                } else {
                  this.setState({ isTitleValid: false });
                  return "at least 10 characters";
                }
              },
            }}
          />
          <Textbox
            attributesInput={{
              type: "text",
              id: "email",
              name: "email",
              placeholder: "Email",
            }}
            onChange={(email: string, e: any) => {
              this.setState({ email });
            }}
            onBlur={() => {}}
            validationOption={{
              name: "email",
              check: true,
              required: true,
              customFunc: (email: string) => {
                const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (reg.test(String(email).toLowerCase())) {
                  this.setState({ isEmailValid: true });
                  return true;
                } else {
                  this.setState({ isEmailValid: false });
                  return "is not a valid email address";
                }
              },
            }}
          />
          <Textarea
            attributesInput={{
              id: "content",
              name: "content",
              placeholder: "Please detail your issue...",
            }}
            onChange={(content: string, e: any) => {
              this.setState({ content });
            }}
            onBlur={() => {}}
            validationOption={{
              name: "content",
              check: true,
              required: true,
              customFunc: (content: string) => {
                if (content.length > 50) {
                  this.setState({ isContentValid: true });
                  return true;
                } else {
                  this.setState({ isContentValid: false });
                  return "at least 50 characters";
                }
              },
            }}
          />
          <button type="submit" className="submit-btn">
            Add Ticket
          </button>
        </form>
      </div>
    );
  }
}
