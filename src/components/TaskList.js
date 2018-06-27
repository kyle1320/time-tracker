import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TaskList.css';
import TaskHeader from './TaskHeader';
import TaskToolbar from './TaskToolbar';

const mapStateToProps = state => ({
  tasks: state.tasks,
  selectedTask: state.selectedTask
});

class TaskList extends Component {
  render() {
    return (
      <div className="task-list">
        <TaskToolbar />
        {this.props.tasks.map(task =>
          <TaskHeader
            task={task}
            isSelected={this.props.selectedTask === task.id}
            key={task.id} />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(TaskList);