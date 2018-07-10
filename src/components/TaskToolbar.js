import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faPlusSquare,
  faUndo,
  faSortAlphaDown } from '@fortawesome/free-solid-svg-icons'

import './TaskToolbar.css';

import { newTask, resetAll, sortName } from '../data/actions';
import IconWrapper from './IconWrapper';

const mapDispatchToProps = dispatch => ({
  triggerNewTask:  () => dispatch(newTask()),
  triggerResetAll: () => dispatch(resetAll()),
  triggerSortName: () => dispatch(sortName())
});

class TaskToolbar extends Component {
  constructor() {
    super();

    this.onResetAll = this.onResetAll.bind(this);
  }

  onResetAll() {
    if (window.confirm("Are you sure you want to reset all tasks?")) {
      this.props.triggerResetAll();
    }
  }

  render() {
    return (
      <div className="task-toolbar">
        <div className="title">Time Tracker</div>
        <div className="button-container">
          <IconWrapper
            icon={faPlusSquare}
            className="task-toolbar-btn add"
            title="New Task"
            onClick={this.props.triggerNewTask} />
          <IconWrapper
            icon={faSortAlphaDown}
            className="task-toolbar-btn sort"
            title="Sort Tasks by Name"
            onClick={this.props.triggerSortName} />
          <IconWrapper
            icon={faUndo}
            className="task-toolbar-btn reset"
            title="Reset Task Timers"
            onClick={this.onResetAll} />
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(TaskToolbar);