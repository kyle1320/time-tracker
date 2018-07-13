import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faPencilAlt,
  faPlus,
  faMinus} from '@fortawesome/free-solid-svg-icons'
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
import { formatTime } from '../data/utils';

const mapStateToProps = (state, props) => ({
  isSelected: (state.selectedTask === props.task.id),
  shouldEdit: (state.editTaskId   === props.task.id)
});

const mapDispatchToProps = (dispatch, props) => ({
  onSelect:    ()     => dispatch(select(props.task.id)),
  onDeselect:  ()     => dispatch(deselect()),
  onTick:      ()     => dispatch(tick()),
  onChange:    (data) => dispatch(update(props.task.id, data)),
  onReset:     ()     => dispatch(reset(props.task.id)),
  onDelete:    ()     => dispatch(deleteTask(props.task.id)),
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

  scheduleTick = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.props.isSelected) {
      this.timer = setTimeout(
        this.props.onTick,
        1001 - (this.props.task.time % 1000)
      );
    }
  }

  onChange = (event) => {
    this.props.onChange({[event.target.name]: event.target.value});
  }

  onInputKey = (event) => {
    if (event.keyCode === 13) {
      this.setState({
        isEditing: false
      });
    }
  }

  onToggle = () => {
    if (this.props.isSelected)
      this.props.onDeselect()
    else
      this.props.onSelect()
  }

  onDelete = (event) => {
    if (window.confirm('Are you sure you want to delete "' + this.props.task.name + '"?')) {
      this.props.onDelete(event);
    }
  }

  toggleEditing = (event) => {
    noSelect(event);

    this.setState(state => ({
      ...state,
      isEditing: !state.isEditing
    }));
  }

  handleFocus = (event) => {
    event.target.select();
  }

  render() {
    return (
      <div
          id={this.props.isSelected ? "selected-task" : undefined}
          className={`task-header ${this.props.isSelected ? "selected" : ""} ${this.state.isEditing ? "editing" : ""}`} >
        <SortableHandleItem />
        <div className="task-header-center-content">
          <div className="task-header-main-content">
          <div className="task-header-info" onClick={this.onToggle}>
              {this.state.isEditing
                ? <div className="task-header-details">
                    <input
                      name="name"
                      ref="name"
                      className="task-name"
                      value={this.props.task.name}
                      onChange={this.onChange}
                      onKeyDown={this.onInputKey}
                      onClick={noSelect}
                      onFocus={this.handleFocus} />
                    <textarea
                      name="detail"
                      ref="detail"
                      className="task-detail"
                      value={this.props.task.detail}
                      onChange={this.onChange}
                      onKeyDown={this.onInputKey}
                      onClick={noSelect}
                      onFocus={this.handleFocus} />
                  </div>
                : <div className="task-header-details">
                    <div className="task-name">
                      <div>{this.props.task.name}</div>
                      <IconWrapper
                          icon={faPencilAlt}
                          onClick={this.toggleEditing}
                          title="Edit Task"
                          className="button icon-edit" />
                    </div>
                    <div className="task-detail">
                      {this.props.task.detail}
                    </div>
                  </div>
              }
              <div className="task-time">
                {formatTime("?(%hh )%mm", this.props.task.time)}
              </div>
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
              <div
                  onClick={this.toggleEditing}
                  title="Stop Editing"
                  className="button icon-save" >Save</div>
              <div
                onClick={this.props.onReset}
                title="Reset Task"
                className="button icon-reset" >Reset</div>
              <div
                onClick={this.onDelete}
                title="Delete Task"
                className="button icon-trash" >Delete</div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHeader);