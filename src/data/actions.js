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
  CLEAR_NEW_TASK,
  TIME_RESET,
  TIME_ADD,
  WRAP_UP,
  SORT_NAME,
  THEME_SET,
  PAGE_LOAD } from "./action-constants";

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

export function wrapupDay() {
  return {
    type: WRAP_UP
  };
}

export function addTime(id, delta) {
  return {
    type: TIME_ADD,
    id,
    delta
  };
}

export function clearNewTask() {
  return {
    type: CLEAR_NEW_TASK
  };
}

export function sortName(reverse) {
  return {
    type: SORT_NAME,
    reverse
  };
}

export function setTheme(color) {
  return {
    type: THEME_SET,
    color
  };
}

export function pageLoad() {
  return {
    type: PAGE_LOAD
  };
}