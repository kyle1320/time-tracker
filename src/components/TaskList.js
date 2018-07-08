import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import './TaskList.css';

import TaskHeader from './TaskHeader';
import { move } from '../data/actions';

const mapStateToProps = state => ({
  tasks: state.tasks
});

const mapDispatchToProps = dispatch => ({
  onSortEnd: ({oldIndex, newIndex}) => dispatch(move(oldIndex, newIndex))
});

const SortableItem = SortableElement(TaskHeader);

const SortableList = SortableContainer(({tasks}) => {
  return (
    <div className="task-list">
      {tasks.map((task, index) =>
        <SortableItem
          task={task}
          key={task.id}
          index={index} />
      )}
    </div>
  );
});

class TaskList extends Component {
  onSortStart(_, event) {
    event.preventDefault();
  }

  render() {
    return this.props.tasks.length === 0
      ? <div className="no-tasks">
          <div className="no-tasks-header">No Tasks</div>
          <div className="no-tasks-small">Click + to create a task</div>
        </div>
      : <SortableList
          tasks={this.props.tasks}
          onSortStart={this.onSortStart}
          onSortEnd={this.props.onSortEnd}
          lockAxis="y"
          useDragHandle={true}
          useWindowAsScrollContainer={true} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);