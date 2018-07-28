import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import './App.css';

import SummaryDialog from './components/SummaryDialog';
import TaskToolbar from './components/TaskToolbar';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import { wrapupDay, tick, undo, redo } from './data/actions';
import { colorNameToHex } from './utils/color';
import { Toasts, ToastContext } from './components/Toasts';

const mapStateToProps = state => ({
  themeColor: colorNameToHex(state.present.themeColor)
});

const mapDispatchToProps = dispatch => ({
  onTick:   () => dispatch(tick()),
  onEndDay: () => dispatch(wrapupDay()),
  onUndo:   () => dispatch(undo()),
  onRedo:   () => dispatch(redo())
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
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentDidUpdate() {
    this.updateTheme();
  }

  componentWillUnmount() {
    window.removeEventListener("focus", this.props.onTick);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  updateTheme() {
    document.body.style.backgroundColor = this.props.themeColor;
  }

  onKeyDown = (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;

    switch (event.key) {
      case "z":
        if (event.shiftKey) {
          this.props.onRedo();
        } else {
          this.props.onUndo();
        }
        break;
      case "Z":
      case "y":
        this.props.onRedo();
        break;
      default:
        return;
    }

    event.stopPropagation();
    event.preventDefault();
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

  createToast = (props = {
    title: '',
    icon: null,
    action: () => {},
    actionText: '',
    actionHoverText: '',
    visibleTime: 0,
    fadeOutTime: 0
  }) => {
    this.toasts.current && this.toasts.current.addToast(props);
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
