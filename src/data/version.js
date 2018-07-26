export const CURRENT_VERSION = 5;

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
        })),
        version: 1
      };

    /* falls through */
    case 1:
      state = {
        ...state,
        tasksSorted: false,
        version: 2
      };

    /* falls through */
    case 2:
      state = {
        ...state,
        tasks: state.tasks.map(task => ({
          ...task,
          completedSubtasks: []
        })),
        version: 3
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
    case CURRENT_VERSION:
      break;
    default:
      console.error("State has unknown version: " + state.version);
      break;
  }

  return state;
}