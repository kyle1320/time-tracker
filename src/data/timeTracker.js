import {
  TASK_TICK,
  TASK_ADD,
  TASK_REMOVE,
  TASK_SELECT,
  TASK_UPDATE,
  TIME_RESET,
  APP_PAUSE,
  APP_RESUME } from './action-constants';
import { DEFAULT_STATE } from './data-constants';

function task(state, action) {
  if (!state) {
    return state;
  }

  switch (action.type) {
    case TASK_SELECT:
    case TASK_TICK:
      if (state.id === action._selectedId)
        return {
          ...state,
          time: state.time + action._delta
        };
      else
        return state;
    case TASK_UPDATE:
      if (state.id === action.id)
        return {
          ...state,
          ...action.data
        };
      else
        return state;
    case TIME_RESET:
      return {
        ...state,
        time: 0
      };
    default:
      return state;
  }
}

function createTask(action) {
  return {
    time: 0,
    ...action.data,
    id: action._newId
  };
}

function tasks(state, action) {
  switch (action.type) {
    case TASK_ADD:
      return [
        ...state,
        createTask(action)
      ]
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.id);
    default:
      return state.map(t => task(t, action));
  }
}

function running(state, action) {
  switch (action.type) {
    case APP_PAUSE:
      return false;
    case APP_RESUME:
      return true;
    default:
      return state;
  }
}

function selectedTask(state, action) {
  switch (action.type) {
    case TASK_SELECT:
      return action.id
    default:
      return state;
  }
}

function nextTaskId(state, action) {
  switch (action.type) {
    case TASK_ADD:
      return state + 1;
    default:
      return state;
  }
}

function lastTickTime(state, action) {
  switch (action.type) {
    case APP_PAUSE:
      return -1;
    case APP_RESUME:
      return action._time;
    default:
      if (state.running)
        return action._time;
      else
        return -1;
  }
}

export default function timeTracker(state = DEFAULT_STATE, action) {

  // TODO: this is bad practice...
  action._time = +new Date();

  action._selectedId = state.selectedTask;
  action._newId = state.nextTaskId;
  action._delta = state.lastTickTime && state.lastTickTime > 0
               ? action._time - state.lastTickTime
               : 0;

  return {
    tasks: tasks(state.tasks, action),
    running: running(state.running, action),
    selectedTask: selectedTask(state.selectedTask, action),
    nextTaskId: nextTaskId(state.nextTaskId, action),
    lastTickTime: lastTickTime(state, action)
  };
}