export const TASK_ADD      = 'TASK_ADD';
export const TASK_REMOVE   = 'TASK_REMOVE';
export const TASK_TICK     = 'TASK_TICK';
export const TASK_UPDATE   = 'TASK_UPDATE';
export const TASK_SELECT   = 'TASK_SELECT';
export const TASK_DESELECT = 'TASK_DESELECT';
export const TASK_MOVE     = 'TASK_MOVE';

export const SUBTASK_ADD    = 'SUBTASK_ADD';
export const SUBTASK_REMOVE = 'SUBTASK_REMOVE';

export const PROJECT_ADD = 'PROJECT_ADD';
export const PROJECT_UPDATE = 'PROJECT_EDIT';
export const PROJECT_REMOVE = 'PROJECT_REMOVE';

// clears the id set when a new task is created.
//   this id is used to select the new task for editing,
//   and cleared immediately afterward.
export const CLEAR_NEW_TASK = 'CLEAR_NEW_TASK';

export const TIME_RESET = 'TIME_RESET';
export const TIME_ADD   = 'TIME_ADD';

export const WRAP_UP = 'WRAP_UP';

export const THEME_SET = 'THEME_SET';

export const PAGE_LOAD = 'PAGE_LOAD';

export const UNDO = 'UNDO';
export const REDO = 'REDO';