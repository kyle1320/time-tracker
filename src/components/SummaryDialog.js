import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SummaryDialog.css';

import Button from './buttons/Button';
import IconButton from './buttons/IconButton';
import { formatTime } from '../utils/time';

const mapStateToProps = (state) => ({
  tasks: state.tasks
});

class SummaryDialog extends Component {

  render() {
    return (
      <div className="summary-dialog-container">
        <div className="summary-dialog">
          <div className="summary-dialog-header">
            <div className="summary-dialog-title">Daily Summary</div>
            <IconButton
              icon={faTimes}
              onClick={this.props.onClose}
              title="Close"
              className="summary-dialog-close-btn" />
          </div>
          <div className="summary-dialog-content">
            {this.props.tasks
              .filter(task => {
                return task.time >= 60000 ||
                       task.completedSubtasks.length > 0
              })
              .map(task =>
                <div className="summary-dialog-task-item" key={task.id}>
                  <div className="summary-dialog-task-header">
                    <div className="summary-dialog-task-name">
                      {task.name}
                    </div>
                    <div className="summary-dialog-task-separator"></div>
                    <div className={"summary-dialog-task-time" +
                        (task.time < 60000 ? " inactive" : "")
                    }>
                      {formatTime('?(%h hours, )%m minutes', task.time)}
                    </div>
                  </div>
                  {task.completedSubtasks.map((subtask, index) => (
                    <div key={index} className="summary-dialog-subtask">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="subtask-check" />
                      <div>{subtask.content}</div>
                    </div>
                  ))}
                </div>
            )}
          </div>
          <div className="summary-dialog-footer">
            <Button
                className="summary-dialog-footer-button"
                onClick={this.props.onEndDay}>
              Wrap-up Day & Reset Tasks
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  undefined
)(SummaryDialog);