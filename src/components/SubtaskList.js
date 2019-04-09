import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faAngleUp,
  faAngleDown,
  faCheck} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './SubtaskList.scss';

import Button from './buttons/Button';
import IconButton from './buttons/IconButton';
import { newSubtask, deleteSubtask } from '../data/actions';
import { growHeight, scale } from './transitions';

const mapDispatchToProps = (dispatch, props) => ({
  onCreate:   (content)   => dispatch(newSubtask(props.taskId, content)),
  onComplete: (subtaskId) => dispatch(deleteSubtask(props.taskId, subtaskId))
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

    var containerClass = "subtask-list__container"
      + (showContents ? " open" : " closed")
      + (showButton ? " show-button" : " hide-button");

    return (
      <TransitionGroup className={containerClass}>
        {showButton &&
          <CSSTransition key={1} {...scale}>
            <Button className="subtask-list__btn" onClick={this.toggle}>
              {this.state.isExpanded
                ? <React.Fragment>
                    <FontAwesomeIcon className="icon" icon={faAngleUp}/>
                    Hide Subtasks
                  </React.Fragment>
                : <React.Fragment>
                    <FontAwesomeIcon className="icon" icon={faAngleDown}/>
                    Show Subtasks ({this.props.subtasks.length})
                  </React.Fragment>
              }
            </Button>
          </CSSTransition>
        }
        {showContents &&
          <CSSTransition key={0} {...growHeight}>
            <div className="subtask-list__wrapper">
              <TransitionGroup className="subtask-list">
                {this.props.subtasks.map(subtask => (
                  <CSSTransition key={subtask.id} {...growHeight}>
                    <div className="subtask__wrapper">
                      <div className="subtask" key={subtask.id}>
                        <IconButton
                          icon={faCheck}
                          title="Complete Subtask"
                          className="complete-subtask-btn"
                          onClick={() => this.props.onComplete(subtask.id)} />
                        <div>{subtask.content}</div>
                      </div>
                    </div>
                  </CSSTransition>
                ))}
                {this.props.isEditing &&
                  <CSSTransition key={0} {...growHeight}>
                    <div className="subtask__wrapper">
                      <div className="subtask subtask-list__new">
                        <input
                          ref={this.inputField}
                          onKeyDown={this.onInputKey}
                          required="required"
                          placeholder="Add a Subtask..." />
                        <Button
                          className="add-subtask-btn"
                          onClick={this.onCreate}>Add Subtask</Button>
                      </div>
                    </div>
                  </CSSTransition>
                }
              </TransitionGroup>
            </div>
          </CSSTransition>
        }
      </TransitionGroup>
    );
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(SubtaskList);