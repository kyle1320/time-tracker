import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faPencilAlt,
  faHourglassHalf,
  faPlus,
  faMinus,
  faHistory,
  faUndo} from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { SortableHandle } from 'react-sortable-hoc';

import './TaskHeader.css';

import {
  select,
  deselect,
  tick,
  update,
  reset,
  deleteTask,
  addTime,
  clearNewTask,
  undo } from '../data/actions';
import Button from './buttons/Button';
import IconButton from './buttons/IconButton';
import SubtaskList from './SubtaskList';
import pressAndHold from './pressAndHold';
import { formatTime } from '../utils/time';
import { withToasts } from './Toasts';

const mapStateToProps = (state, props) => ({
  isSelected: (state.present.selectedTask === props.task.id),
  isNewTask:  (state.present.newItemId    === props.task.id)
});

const mapDispatchToProps = (dispatch, props) => ({
  onSelect:     ()     => dispatch(select(props.task.id)),
  onDeselect:   ()     => dispatch(deselect()),
  onTick:       ()     => dispatch(tick()),
  onSave:       (data) => dispatch(update(props.task.id, data)),
  onReset:      ()     => dispatch(reset(props.task.id)),
  onDelete:     ()     => dispatch(deleteTask(props.task.id)),
  onIncrement:  ()     => dispatch(addTime(props.task.id, 60000)),
  onDecrement:  ()     => dispatch(addTime(props.task.id, -60000)),
  clearNewTask: ()     => dispatch(clearNewTask()),
  undo:         ()     => dispatch(undo())
});

const HoldableButton = pressAndHold(IconButton, 80, 500);

const SortableHandleItem = SortableHandle(() => (
  <div className="task-header-handle" title="Drag to Reorder"></div>
));

function noSelect(event) {
  event && event.stopPropagation();
}

class TaskHeader extends Component {
  constructor() {
    super();

    this.state = {
      isEditing: false
    };

    this.nameField   = React.createRef();
    this.detailField = React.createRef();
  }

  componentDidMount() {
    if (this.props.isNewTask) {
      this.props.clearNewTask();
      this.onEdit();
    }

    this.scheduleTick();
  }

  componentDidUpdate(_, prevState) {
    this.scheduleTick();

    if (this.state.isEditing && !prevState.isEditing) {
      this.nameField.current.select();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  scheduleTick = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.props.isSelected) {
      this.timer = setTimeout(
        this.props.onTick,
        60050 - (this.props.task.time % 60000)
      );
    }
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onEdit = (event) => {
    this.setState({
      isEditing: true,
      name: this.props.task.name,
      detail: this.props.task.detail
    });
  }

  onCancelEdit = () => {
    this.setState({ isEditing: false });
  }

  onSave = () => {
    this.props.onSave({
      name: this.state.name,
      detail: this.state.detail
    });

    this.setState({ isEditing: false });
  }

  onInputKey = (event) => {
    if (event.keyCode === 13) {
      this.onSave();
    }
  }

  onToggle = () => {
    if (this.props.isSelected)
      this.props.onDeselect()
    else
      this.props.onSelect()
  }

  onDelete = (event) => {
    this.props.onDelete(event);
    this.props.createToast({
      title: "Deleted " + this.props.task.name,
      icon: faUndo,
      action: this.props.undo,
      actionText: "Undo"
    });
  }

  render() {
    return (
      <div className="task-header-container">
        <div
            id={this.props.isSelected ? "selected-task" : undefined}
            className={`task-header ${this.props.isSelected ? "selected" : ""} ${this.state.isEditing ? "editing" : ""}`} >
          <SortableHandleItem />
          <div className="task-header-center-content">
            <div className="task-header-main-content" onClick={this.onToggle}>
              {this.state.isEditing
                ? <div className="task-header-details">
                    <input
                      name="name"
                      ref={this.nameField}
                      size="1"
                      className="task-name"
                      placeholder="Add a Title"
                      value={this.state.name}
                      onChange={this.onChange}
                      onKeyDown={this.onInputKey}
                      onClick={noSelect} />
                    <textarea
                      name="detail"
                      ref={this.detailField}
                      size="1"
                      className="task-detail"
                      placeholder="Add a Description"
                      value={this.state.detail}
                      onChange={this.onChange}
                      onKeyDown={this.onInputKey}
                      onClick={noSelect} />
                  </div>
                : <div className="task-header-details">
                    <div className="task-name">
                      <div>{this.props.task.name}</div>
                      <IconButton
                          icon={faPencilAlt}
                          onClick={this.onEdit}
                          title="Edit Task"
                          className="button icon-edit" />
                    </div>
                    <div className="task-detail">
                      {this.props.task.detail}
                    </div>
                  </div>
              }
              <div className="task-time">
                {this.state.isEditing
                  ? <IconButton
                      icon={faHistory}
                      onClick={this.props.onReset}
                      title="Reset Task"
                      className="button icon-reset" />
                  : (this.props.isSelected &&
                    <FontAwesomeIcon
                      icon={faHourglassHalf}
                      className="icon-running" />)
                }
                <div>{formatTime("?(%hh )%mm", this.props.task.time)}</div>
              </div>
              <div className="task-time-buttons">
                <HoldableButton
                  icon={faPlus}
                  onTrigger={this.props.onIncrement}
                  title="Add a Minute"
                  className="button icon-plus-time" />
                <HoldableButton
                  icon={faMinus}
                  onTrigger={this.props.onDecrement}
                  title="Subtract a Minute"
                  className="button icon-minus-time" />
              </div>
            </div>
            {this.state.isEditing &&
              <div className="task-header-buttons">
                <Button
                  onClick={this.onSave}
                  title="Save Changes"
                  className="button icon-save" >Save</Button>
                <div className="button-divider" />
                <Button
                  onClick={this.onCancelEdit}
                  title="Undo Changes"
                  className="button icon-cancel" >Cancel</Button>
                <Button
                  onClick={this.onDelete}
                  title="Delete Task"
                  className="button icon-trash" >Delete</Button>
              </div>
            }
          </div>
        </div>
        <SubtaskList
          taskId={this.props.task.id}
          subtasks={this.props.task.subtasks}
          isEditing={this.state.isEditing} />
      </div>
    );
  }
}

export default withToasts(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TaskHeader)
);