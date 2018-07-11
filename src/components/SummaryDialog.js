import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './SummaryDialog.css';

import { resetAll } from '../data/actions';
import { formatTime } from '../data/utils';
import IconWrapper from './IconWrapper';

const mapStateToProps = (state) => ({
  tasks: state.tasks
});

const mapDispatchToProps = (dispatch) => ({
  onReset: () => dispatch(resetAll())
});

class SummaryDialog extends Component {

  render() {
    return (
      <div className="summary-dialog-container">
        <div className="summary-dialog">
          <div className="summary-dialog-header">
            <div className="summary-dialog-title">Daily Summary</div>
            <IconWrapper
              icon={faTimes}
              onClick={this.props.onClose}
              title="Close"
              className="summary-dialog-close-btn" />
          </div>
          <div className="summary-dialog-content">
            {this.props.tasks.map(task =>
              <div className="summary-dialog-task-item" key={task.id}>
                <div className="summary-dialog-task-name">
                  {task.name}
                </div>
                <div className="summary-dialog-task-separator"></div>
                <div className="summary-dialog-task-time">
                  {formatTime('?(%h hours, )%m minutes', task.time)}
                </div>
              </div>
            )}
          </div>
          <div className="summary-dialog-footer">
            <div
                className="summary-dialog-footer-button"
                onClick={this.props.onEndDay}>
              Wrap-up Day & Resets Tasks
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryDialog);