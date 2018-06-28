import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconWrapper from './IconWrapper';
import { faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons'

import './TaskToolbar.css';
import { newTask, reset } from '../data/actions';

const mapDispatchToProps = dispatch => ({
  triggerNewTask: () => dispatch(newTask()),
  triggerReset:   () => dispatch(reset())
});

class TaskToolbar extends Component {
  render() {
    return (
      <div className="task-toolbar">
        <IconWrapper
          icon={faPlusSquare}
          className="task-toolbar-btn add"
          title="New Task"
          onClick={this.props.triggerNewTask} />
        <IconWrapper
          icon={faUndo}
          className="task-toolbar-btn reset"
          title="Reset Task Timers"
          onClick={this.props.triggerReset} />
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(TaskToolbar);