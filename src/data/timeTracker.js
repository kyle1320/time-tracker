import { arrayMove } from 'react-sortable-hoc';

import {
  TASK_TICK,
  TASK_ADD,
  TASK_REMOVE,
  TASK_SELECT,
  TASK_DESELECT,
  TASK_UPDATE,
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
  REDO } from './action-constants';
import { upgradeVersion } from './version';
import { findIndex } from '../utils/findIndex';
import History from '../utils/History';

const history = new History(timeTracker, 25);

function task(state, action) {
  switch (action.type) {
    case PAGE_LOAD:
    case TASK_TICK:
    case UNDO:
    case REDO:
    case TASK_SELECT:
    case TASK_DESELECT:
      if (state.id === action._selectedId)
        return {
          ...state,
          time: state.time + action._delta
        };
      else
        return state;
    case TASK_UPDATE:
      if (state.id === action.payload.id)
        return {
          ...state,
          ...action.payload.data
        };
      else
        return state;
    case TIME_RESET:
      if (state.id === action.payload.id)
        return {
          ...state,
          time: 0
        };
      else
        return state;
    case WRAP_UP:
      return {
        ...state,
        time: 0,
        completedSubtasks: []
      };
    case TIME_ADD:
      if (state.id === action.payload.id)
        return {
          ...state,
          time: Math.max(0, state.time + action.payload.delta)
        };
      else
        return state;
    case SUBTASK_ADD:
      if (state.id === action.payload.id)
        return {
          ...state,
          subtasks: [...state.subtasks, createSubtask(action)]
        };
      else
        return state;
    case SUBTASK_REMOVE:
      if (state.id === action.payload.id) {
        var newSubtasks = state.subtasks.slice();
        var newCompletedSubtasks =
          state.completedSubtasks.concat(newSubtasks.splice(action.payload.index, 1));

        return {
          ...state,
          subtasks: newSubtasks,
          completedSubtasks: newCompletedSubtasks
        };
      } else
        return state;
    default:
      return state;
  }
}

function project(state, action) {
  switch (action.type) {
    case PROJECT_UPDATE:
      if (state.id === action.payload.id)
        return {
          ...state,
          ...action.payload.data
        };
      else
        return state;
    default:
      return state;
  }
}

function taskOrProject(state, action) {
  return state.isProject
    ? project(state, action)
    : task(state, action)
}

function createSubtask(action) {
  return {
    time: action.time,
    content: action.payload.content
  };
}

function createTask(action) {
  return {
    name: '',
    detail: '',
    time: 0,
    id: 0,
    subtasks: [],
    completedSubtasks: [],
    ...action.payload.data
  };
}

function createProject(action) {
  return {
    name: '',
    isProject: true,
    isHidden: false,
    id: 0,
    ...action.payload.data
  };
}

function tasks(state, action) {
  var newState;

  switch (action.type) {
    case TASK_ADD:
      var insertIndex = findIndex(state, x => x.id === action.payload.after) + 1;
      newState = state.map(t => taskOrProject(t, action));

      newState.splice(insertIndex, 0, createTask(action));

      return newState;
    case PROJECT_ADD:
      return [
        ...state.map(t => taskOrProject(t, action)),
        createProject(action)
      ];
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.payload.id);
    case PROJECT_REMOVE:
      var relocatedTasks = [];
      var lastUnsortedIndex = 0;
      var haveSeenAnyProject = false;
      var relocateTasks = false;
      newState = state.reduce((arr, item, index) => {
        if (!haveSeenAnyProject) lastUnsortedIndex = index;
        if (item.isProject) haveSeenAnyProject = true;

        if (item.id === action.payload.id) {
          relocateTasks = true;
        } else if (item.isProject) {
          relocateTasks = false;
          arr.push(item);
        } else if (relocateTasks) {
          relocatedTasks.push(item);
        } else {
          arr.push(item);
        }

        return arr;
      }, []);

      newState.splice(lastUnsortedIndex, 0, ...relocatedTasks);

      return newState;
    case TASK_MOVE:
      return arrayMove(
        state.map(t => taskOrProject(t, action)),
        action.payload.oldIndex,
        action.payload.newIndex
      );
    default:
      return state.map(t => taskOrProject(t, action));
  }
}

function selectedTask(state, action) {
  switch (action.type) {
    case TASK_SELECT:
      return action.payload.id;
    case WRAP_UP:
    case TASK_DESELECT:
      return null;
    default:
      return state;
  }
}

function lastTickTime(state, action) {
  switch (action.type) {
    case PAGE_LOAD:
    case TASK_TICK:
    case UNDO:
    case REDO:
    case TASK_SELECT:
    case TASK_DESELECT:
    case WRAP_UP:
      return action.time;
    case TIME_RESET:
      if (action.payload.id === action._selectedId)
        return action.time;
      else
        return state;
    default:
      return state;
  }
}

function newItemId(state, action) {
  switch (action.type) {
    case PROJECT_ADD:
    case TASK_ADD:
      return action.payload.data.id || null;
    case CLEAR_NEW_TASK:
      return null;
    default:
      return state;
  }
}

function themeColor(state, action) {
  switch (action.type) {
    case THEME_SET:
      return action.payload.color;
    default:
      return state;
  }
}

function timeTracker(state, action) {
  if (action.type === PAGE_LOAD) {
    state = upgradeVersion(state);
  }

  action._selectedId = state.selectedTask;
  action._delta = state.lastTickTime && state.lastTickTime > 0
               ? action.time - state.lastTickTime
               : 0;

  return {
    ...state,
    tasks: tasks(state.tasks, action),
    selectedTask: selectedTask(state.selectedTask, action),
    lastTickTime: lastTickTime(state.lastTickTime, action),
    newItemId: newItemId(state.newItemId, action),
    themeColor: themeColor(state.themeColor, action)
  };
}

export default function(state, action) {
  switch (action.type) {
    case UNDO:
      if (action.payload && action.payload.id)
        state = history.undo(state, a => a.id === action.payload.id);
      else
        state = history.undo(state);
      return history.ignore(state, action);
    case REDO:
      state = history.redo(state);
      return history.ignore(state, action);
    case TASK_ADD:
    case PROJECT_ADD:
    case SUBTASK_ADD:
    case TASK_REMOVE:
    case PROJECT_REMOVE:
    case SUBTASK_REMOVE:
    case TASK_UPDATE:
    case PROJECT_UPDATE:
    case TASK_MOVE:
      return history.record(state, action);
    case TASK_TICK:
    case TASK_SELECT:
    case TASK_DESELECT:
    case CLEAR_NEW_TASK:
    case THEME_SET:
      return history.ignore(state, action);
    default:
     return history.norecord(state, action);
  }
}