import { arrayMove } from 'react-sortable-hoc';

import {
  TASK_TICK,
  TASK_ADD,
  TASK_REMOVE,
  TASK_SELECT,
  TASK_DESELECT,
  TASK_UPDATE,
  TASK_MOVE,
  EDIT_CLEAR,
  TIME_RESET,
  TIME_RESET_ALL,
  TIME_ADD,
  SORT_NAME,
  THEME_SET,
  STATE_UPGRADE } from './action-constants';
import { DEFAULT_STATE } from './data-constants';
import customCompare from './customCompare';
import { upgradeVersion } from './version';

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
      if (state.id === action.id)
        return {
          ...state,
          time: 0
        };
      else
        return state;
    case TIME_RESET_ALL:
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
      return [
        createTask(action),
        ...state.map(t => task(t, action))
      ];
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.id);
    case TASK_SELECT:
      return state.map(t => task(t, action))
    case TASK_MOVE:
      return arrayMove(
        state.map(t => task(t, action)),
        action.oldIndex,
        action.newIndex
      );
    case SORT_NAME:
      return state
        .map(t => task(t, action))
        .sort((a, b) => customCompare(a.name, b.name))
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
    case TIME_RESET_ALL:
      return action._time;
    case TIME_RESET:
      if (action.id === action._selectedId)
        return action._time;
      else
        return state;
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

  if (action.type === STATE_UPGRADE) {
    return upgradeVersion(state);
  }

  // TODO: this is bad practice...
  action._time = +new Date();

  action._selectedId = state.selectedTask;
  action._newId = state.nextTaskId;
  action._delta = state.lastTickTime && state.lastTickTime > 0
               ? action._time - state.lastTickTime
               : 0;

  return {
    ...state,
    tasks: tasks(state.tasks, action),
    selectedTask: selectedTask(state.selectedTask, action),
    nextTaskId: nextTaskId(state.nextTaskId, action),
    lastTickTime: lastTickTime(state.lastTickTime, action),
    editTaskId: editTaskId(state.editTaskId, action),
    themeColor: themeColor(state.themeColor, action),
  };
}