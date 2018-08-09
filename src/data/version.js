import uid from '../utils/uid';

export const CURRENT_VERSION = 7;

export function upgradeVersion(state) {
  switch (state.version) {
    case undefined:
      state = {
        ...state,
        version: 0
      };

    /* falls through */
    case 0:
      state = {
        ...state,
        tasks: state.tasks.map(task => ({
          ...task,
          subtasks: []
        }))
      };

    /* falls through */
    case 1:
      state = {
        ...state,
        tasksSorted: false
      };

    /* falls through */
    case 2:
      state = {
        ...state,
        tasks: state.tasks.map(task => ({
          ...task,
          completedSubtasks: []
        }))
      };

    /* falls through */
    case 3:
      state = {
        ...state,
        newTaskId: state.editTaskId
      };
      delete state.editTaskId;

    /* falls through */
    case 4:
      state = {
        ...state,
        newItemId: state.newTaskId
      };
      delete state.newTaskId;

    /* falls through */
    case 5:
      delete state.tasksSorted;
      delete state.nextTaskId;

    /* falls through */
    case 6:
      state = {
        ...state,
        tasks: state.tasks.map(task => ({
          ...task,
          subtasks: task.subtasks.map(subtask => ({
            ...subtask,
            id: uid()
          }))
        }))
      };

    /* falls through */
    case CURRENT_VERSION:
      state = {
        ...state,
        version: CURRENT_VERSION
      };
      break;
    default:
      throw new Error("State has unknown version: " + state.version);
  }

  return state;
}