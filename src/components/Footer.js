import React, { Component } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import './Footer.css';

import ColorChooser from './ColorChooser';
import IconWrapper from './IconWrapper';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <a
            className="github-link"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.github.com/kyle1320/time-tracker">
          <IconWrapper icon={faGithub} />
        </a>
        <ColorChooser />
      </div>
    );
  }
}

export default Footer;