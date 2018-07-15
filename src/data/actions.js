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
  EDIT_CLEAR,
  TIME_RESET,
  TIME_RESET_ALL,
  TIME_ADD,
  SORT_NAME,
  THEME_SET,
  STATE_UPGRADE } from "./action-constants";

export function tick() {
  return {
    type: TASK_TICK
  };
}

export function select(id) {
  return {
    type: TASK_SELECT,
    id
  };
}

export function deselect() {
  return {
    type: TASK_DESELECT
  };
}

export function update(id, data) {
  return {
    type: TASK_UPDATE,
    id,
    data
  };
}

export function move(oldIndex, newIndex) {
  return {
    type: TASK_MOVE,
    oldIndex,
    newIndex
  };
}

export function newTask() {
  return {
    type: TASK_ADD,
    data: {
      name: "New Task",
      detail: ""
    }
  };
}

export function deleteTask(id) {
  return {
    type: TASK_REMOVE,
    id
  };
}

export function newSubtask(taskId, content) {
  return {
    type: SUBTASK_ADD,
    id: taskId,
    content
  };
}

export function deleteSubtask(taskId, index) {
  return {
    type: SUBTASK_REMOVE,
    id: taskId,
    index
  };
}

export function reset(id) {
  return {
    type: TIME_RESET,
    id
  };
}

export function resetAll() {
  return {
    type: TIME_RESET_ALL
  };
}

export function addTime(id, delta) {
  return {
    type: TIME_ADD,
    id,
    delta
  };
}

export function cancelEdit() {
  return {
    type: EDIT_CLEAR
  };
}

export function sortName() {
  return {
    type: SORT_NAME
  };
}

export function setTheme(color) {
  return {
    type: THEME_SET,
    color
  };
}

export function upgrade() {
  return {
    type: STATE_UPGRADE
  };
}