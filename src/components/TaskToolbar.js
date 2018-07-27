import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { faCalendarCheck, faFolder } from '@fortawesome/free-regular-svg-icons'

import './TaskToolbar.css';

import { newTask, newProject } from '../data/actions';
import IconButton from './buttons/IconButton';

const mapDispatchToProps = dispatch => ({
  triggerNewTask:    () => dispatch(newTask()),
  triggerNewProject: () => dispatch(newProject())
});

class TaskToolbar extends Component {
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
  undefined,
  mapDispatchToProps
)(TaskToolbar);