import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TaskHeader.css';
import { select, tick, update, deleteTask } from '../data/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const mapDispatchToProps = (dispatch, props) => ({
  onClick: () => dispatch(select(props.task.id)),
  onTick: () => dispatch(tick()),
  onChange: (data) => dispatch(update(props.task.id, data)),
  onDelete: () => dispatch(deleteTask(props.task.id))
});

class TaskHeader extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
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

  onDelete(e) {
    e.stopPropagation();

    this.props.onDelete();
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
      <div className={`task-header ${this.props.isSelected ? "selected" : ""}`}
           onClick={this.props.onClick}>
        <input
          name="name"
          className="task-name"
          value={this.props.task.name}
          onInput={this.onChange} />
        <div className="task-time">
          {formatTime(this.props.task.time)}
        </div>
        <input
          name="detail"
          className="task-detail"
          value={this.props.task.detail}
          onInput={this.onChange} />
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={this.onDelete}
          className="icon-trash" />
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(TaskHeader);