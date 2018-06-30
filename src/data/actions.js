import {
  TASK_TICK,
  TASK_SELECT,
  TASK_UPDATE,
  TASK_ADD,
  TASK_REMOVE,
  TASK_DESELECT,
  EDIT_CLEAR,
  TIME_RESET,
  TIME_RESET_ALL,
  TIME_ADD,
  SORT_NAME,
  THEME_SET } from "./action-constants";

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

export function newTask() {
  return {
    type: TASK_ADD,
    data: {
      name: "New Task",
      detail: "Add a description"
    }
  };
}

export function deleteTask(id) {
  return {
    type: TASK_REMOVE,
    id
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