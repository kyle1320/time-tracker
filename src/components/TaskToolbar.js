import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck, faFolder } from '@fortawesome/free-regular-svg-icons'

import './TaskToolbar.css';

import { newTask, sortName, newProject } from '../data/actions';
import IconButton from './buttons/IconButton';

const mapStateToProps = state => ({
  sorted: state.tasksSorted
});

const mapDispatchToProps = dispatch => ({
  triggerNewTask:    () => dispatch(newTask()),
  triggerNewProject: () => dispatch(newProject()),
  triggerSortName:   (reverse) => dispatch(sortName(reverse))
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
            icon={faFolder}
            className="task-toolbar-btn add-project"
            title="New Project"
            onClick={this.props.triggerNewProject} />
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