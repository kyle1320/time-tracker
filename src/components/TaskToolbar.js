import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'

import './TaskToolbar.css';
import { pause, resume, newTask, reset } from '../data/actions';


const mapStateToProps = state => ({
  appRunning: state.running
});

const mapDispatchToProps = dispatch => ({
  triggerPause: () => dispatch(pause()),
  triggerResume: () => dispatch(resume()),
  triggerNewTask: () => dispatch(newTask()),
  triggerReset: () => dispatch(reset())
});

class TaskToolbar extends Component {
  render() {
    return (
      <div className="task-toolbar">
        <FontAwesomeIcon
          icon={this.props.appRunning ? faPause : faPlay}
          className={`task-toolbar-btn ${this.props.appRunning ? "pause" : "play"}`}
          onClick={this.props.appRunning ? this.props.triggerPause : this.props.triggerResume} />
        <FontAwesomeIcon
          icon={faPlus}
          className="task-toolbar-btn add"
          onClick={this.props.triggerNewTask} />
        <FontAwesomeIcon
          icon={faUndo}
          className="task-toolbar-btn reset"
          onClick={this.props.triggerReset} />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskToolbar);