import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconWrapper from './IconWrapper';
import { faPlay, faPause, faPlusSquare, faUndo } from '@fortawesome/free-solid-svg-icons'

import './TaskToolbar.css';
import { pause, resume, newTask, reset } from '../data/actions';

const mapStateToProps = state => ({
  appRunning: state.running
});

const mapDispatchToProps = dispatch => ({
  triggerPause:   () => dispatch(pause()),
  triggerResume:  () => dispatch(resume()),
  triggerNewTask: () => dispatch(newTask()),
  triggerReset:   () => dispatch(reset())
});

class TaskToolbar extends Component {
  render() {
    return (
      <div className="task-toolbar">
        <IconWrapper
          icon={this.props.appRunning ? faPause : faPlay}
          className={`task-toolbar-btn ${this.props.appRunning ? "pause" : "play"}`}
          title={this.props.appRunning ? "Pause Tracking" : "Resume Tracking"}
          onClick={this.props.appRunning ? this.props.triggerPause : this.props.triggerResume} />
        <IconWrapper
          icon={faPlusSquare}
          className="task-toolbar-btn add"
          title="New Task"
          onClick={this.props.triggerNewTask} />
        <IconWrapper
          icon={faUndo}
          className="task-toolbar-btn reset"
          title="Reset Task Timers"
          onClick={this.props.triggerReset} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskToolbar);