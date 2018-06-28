import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './IconWrapper.css';

const IconWrapper = (props) => {
  const {icon, ...otherProps} = props;

  var classes = (otherProps.className || '').split(' ');
  classes.push('icon-wrapper');
  otherProps.className = classes.join(' ');

  return (
    <span {...otherProps}>
      <FontAwesomeIcon icon={icon}/>
    </span>
  );
}

export default IconWrapper;