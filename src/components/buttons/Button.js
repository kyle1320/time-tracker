import React, { Component } from 'react';

import './Button.css';

export default class Button extends Component {
  onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onClick && this.props.onClick(event);
  }

  render() {
    var {className, disabled, onClick, ...otherProps} = this.props;

    className = "button " + (disabled ? "disabled " : "") + (className || "");

    return (
      <div
          className={className}
          onClick={this.onClick}
          {...otherProps}>
        {this.props.children}
      </div>
    );
  }
}