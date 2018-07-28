import React, { Component } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Toasts.css';

import Button from './buttons/Button';

const State = {
  NEW: 'NEW',
  VISIBLE: 'VISIBLE',
  HOVER: 'HOVER',
  FADING_OUT: 'FADING_OUT'
};

const defaultFadeOutTime = 1000;
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
          }, this.getVisibleTime());
          break;
        case State.HOVER:
          this.clearTimer();
          break;
        case State.FADING_OUT:
          this.setTimer(() => {
            this.onDone();
          }, this.getFadeOutTime());
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

  getFadeOutTime() {
    return +this.props.fadeOutTime || defaultFadeOutTime;
  }

  getVisibleTime() {
    return +this.props.visibleTime || defaultVisibleTime;
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

  getStyle() {
    switch (this.state.state) {
      case State.FADING_OUT:
        return {
          transitionDuration: (this.getFadeOutTime() / 1000) + 's'
        };
      case State.NEW:
      case State.VISIBLE:
      case State.HOVER:
      default:
        return {
          transitionDuration: '0s'
        };
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
          style={this.getStyle()}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
        <div className="toast__title">{this.props.title}</div>
        {this.props.icon
          ? <Button
              className="toast__action"
              onClick={this.onAction}
              title={this.props.actionHoverText}>
              {this.props.actionText &&
                <div className="toast__action__text">
                  {this.props.actionText}
                </div>
              }
              <FontAwesomeIcon icon={this.props.icon} />
            </Button>
          : <Button
              className="toast__action"
              onClick={this.onDone}
              title="Close">
              <FontAwesomeIcon icon={faTimes} />
            </Button>
        }
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

  addToast(props = {
    title: '',
    icon: null,
    action: () => {},
    actionText: '',
    actionHoverText: '',
    visibleTime: 0,
    fadeOutTime: 0
  }) {
    props.id = this.currentToastId++;

    this.setState(({toasts}) => ({toasts: toasts.concat(props)}));
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