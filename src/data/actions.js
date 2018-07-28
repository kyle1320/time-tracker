import {
  TASK_TICK,
  TASK_SELECT,
  TASK_UPDATE,
  TASK_ADD,
  TASK_REMOVE,
  TASK_DESELECT,
  TASK_MOVE,
  SUBTASK_ADD,
  SUBTASK_REMOVE,
  PROJECT_ADD,
  PROJECT_UPDATE,
  PROJECT_REMOVE,
  CLEAR_NEW_TASK,
  TIME_RESET,
  TIME_ADD,
  WRAP_UP,
  THEME_SET,
  PAGE_LOAD,
  UNDO,
  REDO } from "./action-constants";
import uid from "../utils/uid";

function makeAction(type, payload) {
  return {
    type: type,
    payload: payload,
    time: +new Date(),
    id: uid()
  };
}

export function tick() {
  return makeAction(TASK_TICK);
}

export function select(id) {
  return makeAction(TASK_SELECT, {
    id
  });
}

export function deselect() {
  return makeAction(TASK_DESELECT);
}

export function update(id, data) {
  return makeAction(TASK_UPDATE, {
    data,
    id
  });
}

export function move(oldIndex, newIndex) {
  return makeAction(TASK_MOVE, {
    oldIndex,
    newIndex
  });
}

export function newTask(afterId) {
  return makeAction(TASK_ADD, {
    after: afterId,
    data: {
      id: uid(),
      name: "New Task",
      detail: ""
    }
  });
}

export function deleteTask(id) {
  return makeAction(TASK_REMOVE, {
    id
  });
}

export function newSubtask(taskId, content) {
  return makeAction(SUBTASK_ADD, {
    id: taskId,
    content
  });
}

export function deleteSubtask(taskId, index) {
  return makeAction(SUBTASK_REMOVE, {
    id: taskId,
    index
  });
}

export function newProject() {
  return makeAction(PROJECT_ADD, {
    data: {
      id: uid(),
      name: "New Project"
    }
  });
}

export function updateProject(id, data) {
  return makeAction(PROJECT_UPDATE, {
    data,
    id
  });
}

export function deleteProject(projectId) {
  return makeAction(PROJECT_REMOVE, {
    id: projectId
  });
}

export function reset(id) {
  return makeAction(TIME_RESET, {
    id
  });
}

export function wrapupDay() {
  return makeAction(WRAP_UP);
}

export function addTime(id, delta) {
  return makeAction(TIME_ADD, {
    id,
    delta
  });
}

export function clearNewTask() {
  return makeAction(CLEAR_NEW_TASK);
}

export function setTheme(color) {
  return makeAction(THEME_SET, {
    color
  });
}

export function pageLoad() {
  return makeAction(PAGE_LOAD);
}

export function undo(actionId) {
  return makeAction(UNDO, {id: actionId});
}

export function redo() {
  return makeAction(REDO);
}