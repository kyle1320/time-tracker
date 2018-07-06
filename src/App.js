import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import TaskToolbar from './components/TaskToolbar';
import TaskList from './components/TaskList';
import ColorChooser from './components/ColorChooser';

const mapStateToProps = state => ({
  themeColor: state.themeColor
});

class App extends Component {
  componentDidMount() {
    this.updateTheme();
  }

  componentDidUpdate() {
    this.updateTheme();
  }

  updateTheme() {
    document.body.className = this.props.themeColor;
  }

  render() {
    return (
      <div className="app">
          <TaskToolbar />
          <TaskList />
          <ColorChooser />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
