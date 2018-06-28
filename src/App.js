import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import TaskList from './components/TaskList';

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
        <div className='container'>
          <TaskList />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
