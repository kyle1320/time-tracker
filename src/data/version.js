export const CURRENT_VERSION = 1;

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
    case 1: // current version
      break;
    default:
      console.error("State has unknown version: " + state.version);
      break;
  }

  return state;
}