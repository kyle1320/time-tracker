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
  SORT_NAME,
  THEME_SET,
  PAGE_LOAD } from './action-constants';
import customCompare from './customCompare';
import { upgradeVersion } from './version';

function task(state, action) {
  switch (action.type) {
    case PAGE_LOAD:
    case TASK_TICK:
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
    case WRAP_UP:
      return {
        ...state,
        time: 0,
        completedSubtasks: []
      };
    case TIME_ADD:
      if (state.id === action.id)
        return {
          ...state,
          time: Math.max(0, state.time + action.delta)
        };
      else
        return state;
    case SUBTASK_ADD:
      if (state.id === action.id)
        return {
          ...state,
          subtasks: [...state.subtasks, createSubtask(action)]
        };
      else
        return state;
    case SUBTASK_REMOVE:
      if (state.id === action.id) {
        var newSubtasks = state.subtasks.slice();
        var newCompletedSubtasks =
          state.completedSubtasks.concat(newSubtasks.splice(action.index, 1));

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
      if (state.id === action.id)
        return {
          ...state,
          ...action.data
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
    time: action._time,
    content: action.content
  };
}

function createTask(action) {
  return {
    name: '',
    detail: '',
    time: 0,
    id: action._newId,
    subtasks: [],
    completedSubtasks: [],
    ...action.data
  };
}

function createProject(action) {
  return {
    name: '',
    isProject: true,
    isHidden: false,
    id: action._newId,
    ...action.data
  };
}

function tasks(state, action) {
  switch (action.type) {
    case TASK_ADD:
      return [
        createTask(action),
        ...state.map(t => taskOrProject(t, action))
      ];
    case PROJECT_ADD:
      return [
        ...state.map(t => taskOrProject(t, action)),
        createProject(action)
      ];
    case TASK_REMOVE:
      return state.filter(t => t.id !== action.id);
    case PROJECT_REMOVE:
      var relocatedTasks = [];
      var lastUnsortedIndex = 0;
      var haveSeenAnyProject = false;
      var relocateTasks = false;
      var newState = state.reduce((arr, item, index) => {
        if (!haveSeenAnyProject) lastUnsortedIndex = index;
        if (item.isProject) haveSeenAnyProject = true;

        if (item.id === action.id) {
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
        action.oldIndex,
        action.newIndex
      );
    case SORT_NAME:
      return state
        .map(t => taskOrProject(t, action))
        .sort((a, b) => customCompare(a.name, b.name, action.reverse));
    default:
      return state.map(t => taskOrProject(t, action));
  }
}

function selectedTask(state, action) {
  switch (action.type) {
    case TASK_SELECT:
      return action.id;
    case WRAP_UP:
    case TASK_DESELECT:
      return -1;
    default:
      return state;
  }
}

function lastTickTime(state, action) {
  switch (action.type) {
    case PAGE_LOAD:
    case TASK_TICK:
    case TASK_SELECT:
    case TASK_DESELECT:
    case WRAP_UP:
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
    case PROJECT_ADD:
    case TASK_ADD:
      return state + 1;
    default:
      return state;
  }
}

function newItemId(state, action) {
  switch (action.type) {
    case PROJECT_ADD:
    case TASK_ADD:
      return action._newId;
    case CLEAR_NEW_TASK:
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

function tasksSorted(state, action) {
  switch (action.type) {
    case PAGE_LOAD:
    case TASK_ADD:
    case TASK_REMOVE:
    case TASK_MOVE:
      return false;
    case SORT_NAME:
      return !action.reverse;
    default:
      return state;
  }
}

export default function timeTracker(state, action) {
  if (action.type === PAGE_LOAD) {
    state = upgradeVersion(state);
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
    newItemId: newItemId(state.newItemId, action),
    themeColor: themeColor(state.themeColor, action),
    tasksSorted: tasksSorted(state.tasksSorted, action)
  };
}