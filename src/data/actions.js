import {
  TASK_TICK,
  TASK_SELECT,
  TASK_UPDATE,
  TASK_ADD,
  TASK_REMOVE,
  EDIT_CLEAR,
  TIME_RESET,
  TIME_ADD,
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

export function reset() {
  return {
    type: TIME_RESET
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

export function setTheme(color) {
  return {
    type: THEME_SET,
    color
  };
}