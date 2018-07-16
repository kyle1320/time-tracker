import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faPlusSquare,
  faSortAlphaDown,
  faSortAlphaUp } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck } from '@fortawesome/free-regular-svg-icons'

import './TaskToolbar.css';

import { newTask, sortName } from '../data/actions';
import IconButton from './buttons/IconButton';

const mapStateToProps = state => ({
  sorted: state.tasksSorted
});

const mapDispatchToProps = dispatch => ({
  triggerNewTask:  () => dispatch(newTask()),
  triggerSortName: (reverse) => dispatch(sortName(reverse))
});

class TaskToolbar extends Component {
  onSort = () => {
    this.props.triggerSortName(this.props.sorted);
  }

  render() {
    return (
      <div className="task-toolbar">
        <div className="title">Time Tracker</div>
        <div className="button-container">
          <IconButton
            icon={faPlusSquare}
            className="task-toolbar-btn add"
            title="New Task"
            onClick={this.props.triggerNewTask} />
          <IconButton
            icon={this.props.sorted ? faSortAlphaUp : faSortAlphaDown}
            className="task-toolbar-btn sort"
            title="Sort Tasks by Name"
            onClick={this.onSort} />
          <IconButton
            icon={faCalendarCheck}
            className="task-toolbar-btn end-day"
            title="Wrap-up Day"
            onClick={this.props.onEndDay} />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskToolbar);