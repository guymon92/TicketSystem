import React from "react";
import "../App.scss";

export type FontSizeState = {
  fontSize: number;
  name: string;
};

export default class FontSize extends React.Component<
  { onSelectSize: Function },
  FontSizeState
> {
  state: FontSizeState = {
    fontSize: 16,
    name: "Normal Font",
  };

  appendStyle = (selectedFont: FontSizeState) => {
    this.setState({
      fontSize: selectedFont.fontSize,
      name: selectedFont.name,
    });
    this.props.onSelectSize(selectedFont.fontSize);
  };

  render() {
    const { name } = this.state;
    const arrSizes: FontSizeState[] = [
      { name: "Small Font", fontSize: 12 },
      { name: "Normal Font", fontSize: 16 },
      { name: "Large Font", fontSize: 20 },
    ];

    return (
      <div className="fontSize">
        {arrSizes.map((fontSize, i) => {
          return (
            <button
              key={i}
              disabled={fontSize.name === name}
              onClick={() => this.appendStyle(fontSize)}
            >
              {fontSize.name}
            </button>
          );
        })}
      </div>
    );
  }
}
