import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faAngleUp,
  faAngleDown,
  faCheck} from '@fortawesome/free-solid-svg-icons'

import './SubtaskList.css';

import IconWrapper from './IconWrapper';
import { newSubtask, deleteSubtask } from '../data/actions';

const mapDispatchToProps = (dispatch, props) => ({
  onCreate:   (content) => dispatch(newSubtask(props.taskId, content)),
  onComplete: (index) => () => dispatch(deleteSubtask(props.taskId, index))
});

class SubtaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };

    this.inputField = React.createRef();
  }

  toggle = () => {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  onCreate = () => {
    if (!this.inputField.current.value) return;

    this.props.onCreate(this.inputField.current.value);
    this.inputField.current.value = "";

    this.setState({
      isExpanded: true
    });
  }

  onInputKey = (event) => {
    if (event.keyCode === 13) {
      this.onCreate();
    }
  }

  render() {
    var showButton = this.props.subtasks.length > 0 && !this.props.isEditing;
    var showContents = this.state.isExpanded || this.props.isEditing;

    var containerClass = "subtask-list-container"
      + (showContents ? " open" : " closed")
      + (showButton ? " show-button" : " hide-button");

    return (
      <div className={containerClass}>
        <div className="subtask-list">
          {this.props.subtasks.map((subtask, index) => (
            <div className="subtask" key={index}> {/* TODO: use IDs */}
              <IconWrapper
                icon={faCheck}
                title="Complete Subtask"
                className="complete-subtask-btn"
                onClick={this.props.onComplete(index)} />
              <div>{subtask.content}</div>
            </div>
          ))}
          {this.props.isEditing &&
            <div className="subtask subtask-list-new">
              <input
                ref={this.inputField}
                onKeyDown={this.onInputKey}
                required="required"
                placeholder="Add a Subtask..." />
              <div
                className="add-subtask-btn"
                onClick={this.onCreate}>Add Subtask</div>
            </div>
          }
        </div>
        <div className="subtask-list-btn" onClick={this.toggle}>
          {this.state.isExpanded
            ? <React.Fragment>
                <IconWrapper
                  icon={faAngleUp} />
                Hide Subtasks
              </React.Fragment>
            : <React.Fragment>
                <IconWrapper
                  icon={faAngleDown} />
                Show Subtasks ({this.props.subtasks.length})
              </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(SubtaskList);