import React, { Component } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Footer.scss';

import ColorChooser from './ColorChooser';

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <a
            className="icon-button github-link"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.github.com/kyle1320/time-tracker">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <ColorChooser />
      </div>
    );
  }
}

export default Footer;