import * as actionCreators from '../actions';
import {
  tick,
  select,
  deselect,
  update,
  move,
  newTask,
  deleteTask,
  newSubtask,
  deleteSubtask,
  newProject,
  updateProject,
  deleteProject,
  reset,
  wrapupDay,
  addTime,
  clearNewTask,
  setTheme,
  pageLoad,
  undo,
  redo
} from '../actions';

it("creates actions with the correct format", () => {
  for (var actionCreatorName in actionCreators) {
    var actionCreator = actionCreators[actionCreatorName];
    
    var action = actionCreator();

    expect(action).toHaveProperty('type');
    expect(action.type).toMatch(/^[0-9A-Z_-]+$/);

    expect(action).toHaveProperty('payload');

    expect(action).toHaveProperty('time');
    expect(typeof action.time).toBe('number');

    expect(action).toHaveProperty('id');
    expect(action.id).toMatch(/^[0-9A-Z]{9}/i);
  }
});