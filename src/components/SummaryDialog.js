import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SummaryDialog.scss';

import Button from './buttons/Button';
import IconButton from './buttons/IconButton';
import { formatTime } from '../utils/time';

const mapStateToProps = (state) => ({
  tasks: state.present.tasks
});

class SummaryDialog extends Component {

  render() {
    return (
      <div className="summary-dialog__container">
        <div className="summary-dialog">
          <div className="summary-dialog__header">
            <div className="summary-dialog__title">Daily Summary</div>
            <IconButton
              icon={faTimes}
              onClick={this.props.onClose}
              title="Close"
              className="summary-dialog__close-btn" />
          </div>
          <div className="summary-dialog__content">
            {this.props.tasks
              .filter(item => {
                return item.isProject ||
                        (
                          item.time >= 60000 ||
                          item.completedSubtasks.length > 0
                        )
              })
              .filter((item, index, arr) => {
                return !item.isProject ||
                        (
                          index < arr.length - 1 &&
                          !arr[index + 1].isProject
                        )
              })
              .map(item => item.isProject
                ? <div className="summary-dialog__project-name" key={item.id}>
                    {item.name}
                  </div>
                : <div className="summary-dialog__task__item" key={item.id}>
                    <div className="summary-dialog__task__header">
                      <div className="summary-dialog__task__name">
                        {item.name}
                      </div>
                      <div className="summary-dialog__task__separator"></div>
                      <div className={"summary-dialog__task__time" +
                          (item.time < 60000 ? " inactive" : "")
                      }>
                        {formatTime('?(%h hours, )%m minutes', item.time)}
                      </div>
                    </div>
                    {item.completedSubtasks.map((subtask, index) => (
                      <div key={index} className="summary-dialog__subtask">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="subtask-check" />
                        <div>{subtask.content}</div>
                      </div>
                    ))}
                  </div>
            )}
          </div>
          <div className="summary-dialog__footer">
            <Button
                className="summary-dialog__footer__button"
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