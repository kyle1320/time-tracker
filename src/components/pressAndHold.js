import React, { Component } from 'react';

function joinFunc(obj, prop, cb) {
  var oldFunc = obj[prop];

  obj[prop] = function () {
    oldFunc && oldFunc.apply(this, arguments);
    cb.apply(this, arguments);
  };
}

// a HOC that supports pressing and holding on an element,
// in order to trigger that element's onClick event many times.
export default function pressAndHold(
    InnerComponent,
    repeatDelay = 100,
    initialDelay = 0) {

  return class extends Component {
    constructor(props) {
      super(props);

      this.tickInterval = null;
      this.delayTimeout = null;
      this.preventClickTimeout = null;

      this.preventClick = false;
    }

    tick = (event) => {
      this.props.onTrigger(event);
    }

    stop = (event) => {
      if (this.tickInterval) {
        clearInterval(this.tickInterval);
        this.tickInterval = null;
      }

      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = null;
      }

      if (this.preventClickTimeout) {
        clearTimeout(this.preventClickTimeout);
        this.preventClickTimeout = null;
        this.preventClick = false;
      }

      if (event) {
        this.preventClick = true;
        this.preventClickTimeout = setTimeout(() => {
          this.preventClick = false;
        }, 100);

        event.preventDefault();
      }
    }

    start = (event) => {

      // primary mouse button only
      if (event && event.type === 'mousedown' && event.button !== 0) return;

      // no repeat events
      if (this.delayTimeout || this.tickTimeout) return;

      this.tick(event);

      this.delayTimeout = setTimeout(() => {
        this.delayTimeout = null;
        this.tickInterval = setInterval(this.tick, repeatDelay);
      }, initialDelay);
    }

    onClick = (event) => {
      if (!this.preventClick) {
        this.tick(event);
      }
    }

    componentWillUnmount() {
      this.stop();
    }

    render() {
      var newProps = {...this.props};

      joinFunc(newProps, 'onMouseDown',   this.start);
      joinFunc(newProps, 'onMouseUp',     this.stop);
      joinFunc(newProps, 'onMouseLeave',  this.stop);
      joinFunc(newProps, 'onTouchStart',  this.start);
      joinFunc(newProps, 'onTouchEnd',    this.stop);
      joinFunc(newProps, 'onTouchCancel', this.stop);

      joinFunc(newProps, 'onClick',       this.onClick);

      delete newProps.onTrigger;

      return (
        <InnerComponent {...newProps}>
          {this.props.children}
        </InnerComponent>
      );
    }
  }
}