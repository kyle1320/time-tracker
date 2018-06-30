import {
  TASK_TICK,
  TASK_ADD,
  TASK_REMOVE,
  TASK_SELECT,
  TASK_DESELECT,
  TASK_UPDATE,
  EDIT_CLEAR,
  TIME_RESET,
  TIME_ADD,
  THEME_SET } from './action-constants';
import { DEFAULT_STATE } from './data-constants';

function task(state, action) {
  if (!state) {
    return state;
  }

  switch (action.type) {
    case TASK_SELECT:
    /* falls through */
    case TASK_DESELECT:
      if (state.id === action._selectedId)
        return {
          ...state,
          time: state.time + action._delta
        };
      else
        return state;
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
      var newState = state.map(t => task(t, action));
      var newTask = createTask(action);

      if (newState.length > 0 && newState[0].id === action._selectedId) {
        var selectedTask = newState.shift();
        newState.unshift(newTask);
        newTask = selectedTask;
      }

      newState.unshift(newTask);

      return newState;
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.id);
    case TASK_SELECT:
      newState = [];

      state.forEach(t => {
        var newTask = task(t, action);

        if (newTask.id === action.id) {
          newState.unshift(newTask);
        } else {
          newState.push(newTask);
        }
      });

      return newState;
    default:
      return state.map(t => task(t, action));
  }
}

function selectedTask(state, action) {
  switch (action.type) {
    case TASK_SELECT:
      return action.id
    case TASK_DESELECT:
      return -1;
    default:
      return state;
  }
}

function lastTickTime(state, action) {
  switch (action.type) {
    case TASK_TICK:
    case TASK_SELECT:
    case TIME_RESET:
      return action._time;
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
    selectedTask: selectedTask(state.selectedTask, action),
    nextTaskId: nextTaskId(state.nextTaskId, action),
    lastTickTime: lastTickTime(state.lastTickTime, action),
    editTaskId: editTaskId(state.editTaskId, action),
    themeColor: themeColor(state.themeColor, action)
  };
}