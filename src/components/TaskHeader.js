import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faTrashAlt,
  faPlus,
  faMinus,
  faEdit,
  faSave,
  faUndo } from '@fortawesome/free-solid-svg-icons'
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
  cancelEdit } from '../data/actions';
import IconWrapper from './IconWrapper';
import pressAndHold from './pressAndHold';

const mapStateToProps = (state, props) => ({
  isSelected: (state.selectedTask === props.task.id),
  shouldEdit: (state.editTaskId   === props.task.id)
});

const mapDispatchToProps = (dispatch, props) => ({
  onSelect:    ()     => dispatch(select(props.task.id)),
  onDeselect:  ()     => dispatch(deselect()),
  onTick:      ()     => dispatch(tick()),
  onChange:    (data) => dispatch(update(props.task.id, data)),
  onDelete:    ()     => dispatch(deleteTask(props.task.id)),
  onReset:     ()     => dispatch(reset(props.task.id)),
  onIncrement: ()     => dispatch(addTime(props.task.id, 60000)),
  onDecrement: ()     => dispatch(addTime(props.task.id, -60000)),
  cancelEdit:  ()     => dispatch(cancelEdit())
});

const HoldableButton = pressAndHold(IconWrapper, 80, 500);

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

    this.onChange = this.onChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
  }

  componentDidMount() {
    if (this.props.shouldEdit) {
      this.props.cancelEdit();
      this.setState({
        isEditing: true
      });
    }

    this.scheduleTick();
  }

  componentDidUpdate(_, prevState) {
    this.scheduleTick();

    if (this.state.isEditing && !prevState.isEditing) {
      this.refs.name.select();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  scheduleTick() {
    if (this.props.isSelected) {
      this.timer = setTimeout(
        this.props.onTick,
        1001 - (this.props.task.time % 1000)
      );
    } else if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onChange(event) {
    this.props.onChange({[event.target.name]: event.target.value});
  }

  onInputKey(event) {
    if (event.keyCode === 13) {
      this.setState({
        isEditing: false
      });
    }
  }

  onToggle(event) {
    noSelect(event);

    if (this.props.isSelected)
      this.props.onDeselect()
    else
      this.props.onSelect()
  }

  onReset(event) {
    noSelect(event);

    this.props.onReset(event);
  }

  onDelete(event) {
    noSelect(event);

    if (window.confirm('Are you sure you want to delete "' + this.props.task.name + '"?')) {
      this.props.onDelete(event);
    }
  }

  onIncrement(event) {
    noSelect(event);

    this.props.onIncrement(event);
  }

  onDecrement(event) {
    noSelect(event);

    this.props.onDecrement(event);
  }

  toggleEditing(event) {
    noSelect(event);

    this.setState(state => ({
      ...state,
      isEditing: !state.isEditing
    }));
  }

  handleFocus(event) {
    noSelect(event);

    event.target.select();
  }

  render() {
    function formatTime(time) {
      var millis = time % 1000;
      time = (time - millis) / 1000;

      var seconds = time % 60;
      time = (time - seconds) / 60;

      var minutes = time % 60;
      time = (time - minutes) / 60;

      var hours = time;

      return (hours ? hours + "h " : "") + minutes + "m";
    }

    return (
      <div
          id={this.props.isSelected ? "selected-task" : undefined}
          className={`task-header ${this.props.isSelected ? "selected" : ""} ${this.state.isEditing ? "editing" : ""}`}
          onClick={this.onToggle}>
        <SortableHandleItem />
        <div className="task-header-center-content">
          <div className="task-header-info">
            <div className="task-header-details">
              {this.state.isEditing
                ? [
                  <input
                    name="name"
                    ref="name"
                    key="name"
                    className="task-name"
                    value={this.props.task.name}
                    onChange={this.onChange}
                    onKeyDown={this.onInputKey}
                    onClick={noSelect}
                    onFocus={this.handleFocus} />,
                  <textarea
                    name="detail"
                    ref="detail"
                    key="detail"
                    className="task-detail"
                    value={this.props.task.detail}
                    onChange={this.onChange}
                    onKeyDown={this.onInputKey}
                    onClick={noSelect}
                    onFocus={this.handleFocus} />
                  ]
                : [
                  <div className="task-name" key="name">
                    {this.props.task.name}
                  </div>,
                  <div className="task-detail" key="detail">
                    {this.props.task.detail}
                  </div>
                ]
              }
            </div>
            <div className="task-time">
              {formatTime(this.props.task.time)}
            </div>
            <div className="task-time-buttons">
              <HoldableButton
                icon={faPlus}
                onTrigger={this.onIncrement}
                onClick={noSelect}
                title="Add a Minute"
                className="button icon-plus-time" />
              <HoldableButton
                icon={faMinus}
                onTrigger={this.onDecrement}
                onClick={noSelect}
                title="Subtract a Minute"
                className="button icon-minus-time" />
            </div>
          </div>
          <div className="task-header-buttons">
            <IconWrapper
              icon={faTrashAlt}
              onClick={this.onDelete}
              title="Delete Task"
              className="button icon-trash" />
            <IconWrapper
              icon={faUndo}
              onClick={this.onReset}
              title="Reset Task"
              className="button icon-reset-time" />
            <IconWrapper
              icon={this.state.isEditing ? faSave : faEdit}
              onClick={this.toggleEditing}
              title={this.state.isEditing ? "Stop Editing" : "Edit Task"}
              className="button icon-edit" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHeader);