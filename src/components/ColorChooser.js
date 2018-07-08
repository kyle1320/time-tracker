import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ColorChooser.css';

import { setTheme } from '../data/actions';

const mapDispatchToProps = (dispatch) => ({
  onChange: (color) => dispatch(setTheme(color))
});

class ColorChooser extends Component {
  render() {
    return (
      <div className="color-chooser">
        <div
          className="color-item orange"
          onClick={this.props.onChange.bind(null, "orange")} />
        <div
          className="color-item purple"
          onClick={this.props.onChange.bind(null, "purple")} />
        <div
          className="color-item blue"
          onClick={this.props.onChange.bind(null, "blue")} />
        <div
          className="color-item green"
          onClick={this.props.onChange.bind(null, "green")} />
        <div
          className="color-item red"
          onClick={this.props.onChange.bind(null, "red")} />
        <div
          className="color-item teal"
          onClick={this.props.onChange.bind(null, "teal")} />
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(ColorChooser);