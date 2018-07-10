import { CURRENT_VERSION } from './version';

export const DEFAULT_STATE = {
  selectedTask: -1,
  lastTickTime: -1,
  nextTaskId: 0,
  editTaskId: -1,
  themeColor: '',
  tasks: [],
  version: CURRENT_VERSION
};