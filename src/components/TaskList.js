import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TaskList.css';
import TaskHeader from './TaskHeader';
import TaskToolbar from './TaskToolbar';
import ColorChooser from './ColorChooser';

const mapStateToProps = state => ({
  tasks: state.tasks
});

class TaskList extends Component {
  render() {
    return (
      <div className="task-list">
        <TaskToolbar />
        {this.props.tasks.map(task =>
          <TaskHeader
            task={task}
            key={task.id} />
        )}
        {this.props.tasks.length === 0
          ? <div className="no-tasks">
              <div className="no-tasks-header">No Tasks</div>
              <div className="no-tasks-small">Click + to create a task</div>
            </div>
          : undefined}
        <ColorChooser />
      </div>
    );
  }
}

export default connect(mapStateToProps)(TaskList);