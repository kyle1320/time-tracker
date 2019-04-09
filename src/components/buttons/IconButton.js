import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './IconButton.scss';

import Button from './Button';

export default class IconButton extends Component {
  render() {
    var {icon, className, ...otherProps} = this.props;

    className = "icon-button " + (className || "");

    return (
      <Button className={className} {...otherProps}>
        <FontAwesomeIcon icon={icon}/>
      </Button>
    );
  }
}