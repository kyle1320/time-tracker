import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import './App.css';

import SummaryDialog from './components/SummaryDialog';
import TaskToolbar from './components/TaskToolbar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import { wrapupDay, tick } from './data/actions';
import { colorNameToHex } from './utils/color';
import { Toasts, ToastContext } from './components/Toasts';

const mapStateToProps = state => ({
  themeColor: colorNameToHex(state.themeColor)
});

const mapDispatchToProps = dispatch => ({
  onTick:   () => dispatch(tick()),
  onEndDay: () => dispatch(wrapupDay())
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      showSummary: false
    };

    this.toasts = React.createRef();

    this.showSummary = this.showSummary.bind(this);
    this.closeSummary = this.closeSummary.bind(this);
    this.endDay = this.endDay.bind(this);
  }

  componentDidMount() {
    this.updateTheme();

    window.addEventListener("focus", this.props.onTick);
  }

  componentDidUpdate() {
    this.updateTheme();
  }

  componentWillUnmount() {
    window.removeEventListener("focus", this.props.onTick);
  }

  updateTheme() {
    document.body.style.backgroundColor = this.props.themeColor;
  }

  endDay() {
    this.props.onEndDay();
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

  createToast = (title, icon, action, actionText) => {
    this.toasts.current && this.toasts.current.addToast(
      title, icon, action, actionText
    );
  }

  render() {
    return (
      <ToastContext.Provider value={this.createToast}>
        <div className="app">
          <Helmet>
            <meta name="theme-color" content={this.props.themeColor} />
          </Helmet>
          <TaskToolbar
            onEndDay={this.showSummary}/>
          <TaskList />
          <Footer />
          {this.state.showSummary &&
            <SummaryDialog
              onClose={this.closeSummary}
              onEndDay={this.endDay}/>
          }
          <Toasts ref={this.toasts} />
        </div>
      </ToastContext.Provider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
