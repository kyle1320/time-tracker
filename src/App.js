import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import SummaryDialog from './components/SummaryDialog';
import TaskToolbar from './components/TaskToolbar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import { deselect, resetAll } from './data/actions';

const mapStateToProps = state => ({
  themeColor: state.themeColor
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      showSummary: false
    };

    this.showSummary = this.showSummary.bind(this);
    this.closeSummary = this.closeSummary.bind(this);
    this.endDay = this.endDay.bind(this);
  }

  componentDidMount() {
    this.updateTheme();
  }

  componentDidUpdate() {
    this.updateTheme();
  }

  updateTheme() {
    document.body.className = this.props.themeColor;
  }

  endDay() {
    this.props.dispatch(deselect());
    this.props.dispatch(resetAll());
    this.closeSummary();
  }

  showSummary() {
    this.setState({
      showSummary: true
    });
  }

  closeSummary() {
    this.setState({
      showSummary: false
    });
  }

  render() {
    return (
      <div className="app">
          <TaskToolbar
            onEndDay={this.showSummary}/>
          <TaskList />
          <Footer />
          {this.state.showSummary &&
            <SummaryDialog
              onClose={this.closeSummary}
              onEndDay={this.endDay}/>
          }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  undefined
)(App);
