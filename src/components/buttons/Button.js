import React, { Component } from 'react';

import './Button.css';

export default class Button extends Component {
  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  onKeyUp = (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.buttonRef.current.click();
      event.preventDefault();
    }
  }

  render() {
    var {className, disabled, tabIndex, ...otherProps} = this.props;

    className = "button " + (disabled ? "disabled " : "") + (className || "");

    return (
      <div
          ref={this.buttonRef}
          onKeyUp={this.onKeyUp}
          tabIndex={tabIndex || "0"}
          className={className}
          {...otherProps}>
        {this.props.children}
      </div>
    );
  }
}