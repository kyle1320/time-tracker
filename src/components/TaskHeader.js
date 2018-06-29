import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TaskHeader.css';
import { select, deselect, tick, update, deleteTask, addTime, cancelEdit } from '../data/actions';
import IconWrapper from './IconWrapper';
import { faTrashAlt, faPlay, faPause, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

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
  onIncrement: ()     => dispatch(addTime(props.task.id, 60000)),
  onDecrement: ()     => dispatch(addTime(props.task.id, -60000)),
  cancelEdit:  ()     => dispatch(cancelEdit())
});

class TaskHeader extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  componentDidMount() {
    if (this.props.shouldEdit) {
      this.refs.name.select();
      this.props.cancelEdit();
    }

    this.scheduleTick();
  }

  componentDidUpdate() {
    this.scheduleTick();
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

  onChange(el) {
    this.props.onChange({[el.target.name]: el.target.value});
  }

  onToggle() {
    if (this.props.isSelected)
      this.props.onDeselect()
    else
      this.props.onSelect()
  }

  handleFocus(event) {
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
      <div className={`task-header ${this.props.isSelected ? "selected" : ""}`}>
        <div
          className="task-header-status"
          title={this.props.isSelected ? "Deselect Task" : "Select Task"}
          onClick={this.onToggle} />
        <div className="task-header-info">
          <input
            name="name"
            ref="name"
            className="task-name"
            value={this.props.task.name}
            onChange={this.onChange}
            onFocus={this.handleFocus} />
          <input
            name="detail"
            ref="detail"
            className="task-detail"
            value={this.props.task.detail}
            onChange={this.onChange}
            onFocus={this.handleFocus} />
        </div>
        <div className="task-time">
          {formatTime(this.props.task.time)}
        </div>
        <div className="task-header-buttons">
          <IconWrapper
            icon={faPlus}
            onClick={this.props.onIncrement}
            title="Add 1 Minute"
            className="button icon-plus-time" />
          <IconWrapper
            icon={this.props.isSelected ? faPause : faPlay}
            onClick={this.onToggle}
            title={this.props.isSelected ? "Deselect Task" : "Select Task"}
            className="button icon-select-task" />
          <IconWrapper
            icon={faMinus}
            onClick={this.props.onDecrement}
            title="Subtract 1 Minute"
            className="button icon-minus-time" />
          <IconWrapper
            icon={faTrashAlt}
            onClick={this.props.onDelete}
            title="Delete Task"
            className="button icon-trash" />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHeader);