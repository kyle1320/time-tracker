import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  faTrash,
  faEye,
  faPencilAlt,
  faSave,
  faEyeSlash,
  faUndo} from '@fortawesome/free-solid-svg-icons';

import './ProjectHeader.css';

import {
  deleteProject,
  updateProject,
  clearNewTask,
  undo } from '../data/actions';
import IconButton from './buttons/IconButton';
import { withToasts } from './Toasts';

const mapStateToProps = (state, props) => ({
  isNew: (state.present.newItemId === props.project.id)
});

const mapDispatchToProps = (dispatch, props) => ({
  onDelete: ()     => dispatch(deleteProject(props.project.id)),
  onSave:   (data) => dispatch(updateProject(props.project.id, data)),
  clearNew: ()     => dispatch(clearNewTask()),
  undo:     ()     => dispatch(undo())
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
    this.props.createToast(
      "Deleted " + this.props.project.name,
      faUndo,
      this.props.undo,
      "Undo"
    );
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
          <IconButton
            icon={this.state.isEditing ? faSave : faPencilAlt}
            className="project-header-btn btn-edit"
            title={this.state.isEditing ? "Save Project" : "Edit Project"}
            onClick={this.state.isEditing ? this.onSave : this.onEdit} />
          <IconButton
            icon={this.props.project.isHidden ? faEyeSlash : faEye}
            className="project-header-btn btn-hide"
            title={this.props.project.isHidden ? "Show Project Tasks" : "Hide Project Tasks"}
            onClick={this.toggleHidden} />
          <IconButton
            icon={faTrash}
            className="project-header-btn btn-delete"
            title="Delete Project Header"
            onClick={this.onDelete} />
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