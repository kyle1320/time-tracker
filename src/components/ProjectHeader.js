import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faTrash,
  faEye,
  faPencilAlt,
  faSave,
  faEyeSlash,
  faUndo,
  faPlusSquare,
  faTimes} from '@fortawesome/free-solid-svg-icons';

import './ProjectHeader.css';

import {
  deleteProject,
  updateProject,
  clearNewTask,
  undo,
  newTask} from '../data/actions';
import IconButton from './buttons/IconButton';
import { withToasts } from './Toasts';

const mapStateToProps = (state, props) => ({
  isNew: (state.present.newItemId === props.project.id)
});

const mapDispatchToProps = (dispatch, props) => ({
  onDelete: ()     => dispatch(deleteProject(props.project.id)),
  onSave:   (data) => dispatch(updateProject(props.project.id, data)),
  clearNew: ()     => dispatch(clearNewTask()),
  undo:     ()     => dispatch(undo()),
  newTask:  ()     => dispatch(newTask(props.project.id))
});

class ProjectHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      name: this.props.project.name
    };

    this.nameField = React.createRef();
  }

  componentDidMount() {
    if (this.props.isNew) {
      this.props.clearNew();
      this.onEdit();
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
      this.nameField.current.select();
      this.nameField.current.scrollIntoView();
    }
  }

  toggleHidden = (event) => {
    this.props.onSave({
      isHidden: !this.props.project.isHidden
    });
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onEdit = () => {
    this.setState({
      isEditing: true,
      name: this.props.project.name
    });
  }

  onCancelEdit = () => {
    this.setState({ isEditing: false });
  }

  onSave = () => {
    this.props.onSave({
      name: this.state.name
    });

    this.setState({ isEditing: false });
  }

  onInputKey = (event) => {
    if (event.keyCode === 13) {
      this.onSave();
    }
  }

  onDelete = (event) => {
    this.props.onDelete(event);
    this.props.createToast({
      title: "Deleted " + this.props.project.name,
      icon: faUndo,
      action: this.props.undo,
      actionText: "Undo"
    });
  }

  newTask = () => {
    if (this.props.project.isHidden) {
      this.props.onSave({ isHidden: false });
    }

    this.props.newTask();
  }

  render() {
    return (
      <div className={"project-header" + (this.props.project.isHidden ? " hidden" : "")}>
        {this.state.isEditing
          ? <input
              name="name"
              ref={this.nameField}
              size="1"
              className="project-header-name"
              placeholder="Project Name"
              value={this.state.name}
              onChange={this.onChange}
              onKeyDown={this.onInputKey} />
          : <div className="project-header-name">
              {this.props.project.name}
            </div>
        }

        <div className="project-header-button-container">
        {this.state.isEditing
          ? <React.Fragment>
              <IconButton
                icon={faSave}
                className="project-header-btn btn-save"
                title="Save Project"
                onClick={this.onSave} />
              <IconButton
                icon={faTimes}
                className="project-header-btn btn-cancel"
                title="Cancel Changes"
                onClick={this.onCancelEdit} />
              <IconButton
                icon={faTrash}
                className="project-header-btn btn-delete"
                title="Delete Project Header"
                onClick={this.onDelete} />
            </React.Fragment>
          : <React.Fragment>
              <IconButton
                icon={faPencilAlt}
                className="project-header-btn btn-edit"
                title="Edit Project"
                onClick={this.onEdit} />
              <IconButton
                icon={this.props.project.isHidden ? faEyeSlash : faEye}
                className="project-header-btn btn-hide"
                title={this.props.project.isHidden ? "Show Project Tasks" : "Hide Project Tasks"}
                onClick={this.toggleHidden} />
              <IconButton
                icon={faPlusSquare}
                className="project-header-btn btn-add"
                title="New Task"
                onClick={this.newTask} />
            </React.Fragment>
        }

        </div>
      </div>
    );
  }
}

export default withToasts(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectHeader)
);