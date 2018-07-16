import React, { Component } from 'react';
import { connect } from 'react-redux';

import './ColorChooser.css';

import Button from './buttons/Button';
import { setTheme } from '../data/actions';
import { colorNameToHex } from '../utils/color';

const mapDispatchToProps = (dispatch) => ({
  onChange: (color) => () => dispatch(setTheme(color))
});

const ColorItem = ({onChange, color}) => (
  <Button
    className="color-item"
    style={{backgroundColor: colorNameToHex(color)}}
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