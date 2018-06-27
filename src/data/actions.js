import {
  TASK_TICK,
  TASK_SELECT,
  TASK_UPDATE,
  TASK_ADD,
  TIME_RESET,
  APP_PAUSE,
  APP_RESUME,
  TASK_REMOVE} from "./action-constants";

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

export function resume() {
  return {
    type: APP_RESUME
  };
}

export function pause() {
  return {
    type: APP_PAUSE
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