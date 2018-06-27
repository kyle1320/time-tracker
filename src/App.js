import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import TaskList from './components/TaskList';

const mapStateToProps = state => ({
  appRunning: state.running
});

class App extends Component {
  render() {
    return (
      <div className={`app ${this.props.appRunning ? "running" : "paused"}`}>
        <TaskList />
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
