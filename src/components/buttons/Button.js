import React, { Component } from 'react';

import './Button.css';

export default class Button extends Component {
  render() {
    var {className, disabled, ...otherProps} = this.props;

    className = "button " + (disabled ? "disabled " : "") + (className || "");

    return (
      <div
          className={className}
          {...otherProps}>
        {this.props.children}
      </div>
    );
  }
}