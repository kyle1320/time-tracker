import {
  TASK_TICK,
  TASK_ADD,
  TASK_REMOVE,
  TASK_SELECT,
  TASK_UPDATE,
  EDIT_CLEAR,
  TIME_RESET,
  TIME_ADD,
  APP_PAUSE,
  APP_RESUME,
  THEME_SET } from './action-constants';
import { DEFAULT_STATE } from './data-constants';

function task(state, action) {
  if (!state) {
    return state;
  }

  switch (action.type) {
    case TASK_SELECT:
      if (state.id === action.id)
        return {
          ...state,
          lastActionTime: Infinity // current task is always at the top
        };
      else if (state.id === action._selectedId)
        return {
          ...state,
          time: state.time + action._delta,
          lastActionTime: action._time
        };
      else
        return state;
    case TASK_TICK:
      if (state.id === action._selectedId)
        return {
          ...state,
          time: state.time + action._delta,
          lastActionTime: Infinity
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
    case TIME_ADD:
      if (state.id === action.id)
        return {
          ...state,
          time: Math.max(0, state.time + action.delta)
        };
      else
        return state
    default:
      return state;
  }
}

function taskSort(taskA, taskB) {
  return taskB.lastActionTime - taskA.lastActionTime;
}

function createTask(action) {
  return {
    time: 0,
    ...action.data,
    id: action._newId,
    lastActionTime: action._time
  };
}

function tasks(state, action) {
  switch (action.type) {
    case TASK_ADD:
      return [
        ...state.map(t => task(t, action)),
        createTask(action)
      ].sort(taskSort)
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.id);
    default:
      return state.map(t => task(t, action)).sort(taskSort);
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
    case TIME_RESET:
      return action._time;
    default:
      if (state.running)
        return action._time;
      else
        return -1;
  }
}

function editTaskId(state, action) {
  switch (action.type) {
    case TASK_ADD:
      return action._newId;
    case EDIT_CLEAR:
      return -1;
    default:
      return state;
  }
}

function themeColor(state, action) {
  switch (action.type) {
    case THEME_SET:
      return action.color;
    default:
      return state;
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
    lastTickTime: lastTickTime(state.lastTickTime, action),
    editTaskId: editTaskId(state.editTaskId, action),
    themeColor: themeColor(state.themeColor, action)
  };
}