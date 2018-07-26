import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import './TaskList.css';

import TaskHeader from './TaskHeader';
import ProjectHeader from './ProjectHeader';
import { move } from '../data/actions';

const mapStateToProps = state => ({
  tasks: state.tasks,
  selectedTask: state.selectedTask
});

const mapDispatchToProps = dispatch => ({
  onSortEnd: ({oldIndex, newIndex}) => dispatch(move(oldIndex, newIndex))
});

const SortableItem = SortableElement(TaskHeader);
const SortableProjectHeader = SortableElement(ProjectHeader)

const SortableList = SortableContainer(({selectedTask, tasks}) => {
  return (
    <div className="task-list">
      {tasks.reduce((agg, item, index) => {
        if (item.isProject) {
          agg.ignoreTask = item.isHidden
        } else if (agg.ignoreTask && item.id !== selectedTask) {
          return agg;
        }

        agg.elements.push(item.isProject
          ? <SortableProjectHeader
              project={item}
              key={item.id}
              index={index} />
          : <SortableItem
              task={item}
              key={item.id}
              index={index} />
        );

        return agg;
      }, {elements: [], ignoreTask: false}).elements}
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
          selectedTask={this.props.selectedTask}
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