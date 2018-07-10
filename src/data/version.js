export const CURRENT_VERSION = 0;

export function upgradeVersion(state) {
  switch (state.version) {
    case undefined:
      state = {
        ...state,
        version: 0
      };

    /* falls through */
    case 0: // current version
      break;
    default:
      console.error("State has unknown version: " + state.version);
      break;
  }

  return state;
}