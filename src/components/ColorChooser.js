import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ColorChooser.css';

import { setTheme } from '../data/actions';

const mapDispatchToProps = (dispatch) => ({
  onChange: (color) => () => dispatch(setTheme(color))
});

const ColorItem = ({onChange, color}) => (
  <div
    className={"color-item " + color}
    onClick={onChange(color)} />
);

class ColorChooser extends Component {
  render() {
    return (
      <div className="color-chooser">
        <ColorItem onChange={this.props.onChange} color="orange" />
        <ColorItem onChange={this.props.onChange} color="purple" />
        <ColorItem onChange={this.props.onChange} color="blue" />
        <ColorItem onChange={this.props.onChange} color="green" />
        <ColorItem onChange={this.props.onChange} color="red" />
        <ColorItem onChange={this.props.onChange} color="teal" />
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(ColorChooser);