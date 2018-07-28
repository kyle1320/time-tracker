import React, { Component } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './Toasts.css';

import IconButton from './buttons/IconButton';

const State = {
  NEW: 'NEW',
  VISIBLE: 'VISIBLE',
  HOVER: 'HOVER',
  FADING_OUT: 'FADING_OUT'
};

// TODO: make this configurable
const fadeOutTime = 500;

const defaultVisibleTime = 2500;

class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: State.NEW
    };

    this.timer = null;
  }

  componentDidMount() {
    if (this.state.state === State.NEW) {
      this.setState({state: State.VISIBLE});
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.state !== prevState.state) {
      switch (this.state.state) {
        case State.NEW:
          break;
        case State.VISIBLE:
          this.setTimer(() => {
            this.setState({state: State.FADING_OUT});
          }, this.props.visibleTime || defaultVisibleTime);
          break;
        case State.HOVER:
          this.clearTimer();
          break;
        case State.FADING_OUT:
          this.setTimer(() => {
            this.onDone();
          }, fadeOutTime);
          break;
        default:
          this.onDone();
          break;
      }
    }
  }

  setTimer(callback, delay) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(callback, delay);
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  getClassName() {
    switch (this.state.state) {
      case State.NEW:
      case State.VISIBLE:
        return '';
      case State.HOVER:
        return 'toast--hover';
      case State.FADING_OUT:
      default:
        return 'toast--hidden';
    }
  }

  onAction = (event) => {
    this.props.action && this.props.action(event);
    this.onDone();
  }

  onMouseEnter = () => {
    this.setState({state: State.HOVER});
  }

  onMouseLeave = () => {
    this.setState({state: State.VISIBLE});
  }

  onDone = () => {
    this.props.onDone(this.props.id);
  }

  render() {
    return (
      <div
          className={"toast " + this.getClassName()}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
        <div className="toast__title">{this.props.title}</div>
        <div className="toast__action">
          {this.props.icon
            ? <IconButton
                icon={this.props.icon}
                onClick={this.onAction}
                title={this.props.actionText} />
            : <IconButton
                icon={faTimes}
                onClick={this.onDone}
                title="Close" />
          }
        </div>
      </div>
    );
  }
}

export class Toasts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toasts: []
    };

    this.currentToastId = 0;
  }

  addToast(title, icon, action, actionText) {
    const id = this.currentToastId++;

    this.setState(({toasts}) => ({toasts: toasts.concat(
      {title, icon, action, actionText, id}
    )}));
  }

  onDone = (id) => {
    this.setState(({toasts}) => ({toasts: toasts.filter(t => t.id !== id)}));
  }

  render() {
    return (
      <div className="toast-container">
        {this.state.toasts.map(toastProps =>
          <Toast {...toastProps} key={toastProps.id} onDone={this.onDone} />
        )}
      </div>
    );
  }
}

export const ToastContext = React.createContext(null);
export const withToasts = (InnerComponent) => (props) => (
  <ToastContext.Consumer>
    {createToast => <InnerComponent createToast={createToast} {...props} />}
  </ToastContext.Consumer>
);