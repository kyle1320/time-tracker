import { upgradeVersion, CURRENT_VERSION } from '../version';

it("can upgrade all the way from version 0 to " + CURRENT_VERSION, () => {
  var versionZero = {
    selectedTask: 1,
    lastTickTime: -1,
    nextTaskId: 2,
    editTaskId: -1,
    themeColor: 'purple',
    tasks: [{
      id: 0,
      name: "some task",
      detail: "do some stuff",
      time: 200
    }, {
      id: 1,
      name: "another task",
      detail: "do some more stuff",
      time: 400
    }]
  };

  var upgraded = upgradeVersion(versionZero);

  expect(upgraded).toEqual({
    selectedTask: 1,
    lastTickTime: -1,
    newItemId: -1,
    themeColor: 'purple',
    tasks: [{
      id: 0,
      name: "some task",
      detail: "do some stuff",
      subtasks: [],
      completedSubtasks: [],
      time: 200
    }, {
      id: 1,
      name: "another task",
      detail: "do some more stuff",
      subtasks: [],
      completedSubtasks: [],
      time: 400
    }],
    version: 7
  });
});

it("throws an error on an unrecognized version", () => {
  var badVersion = {
    ohNo: "bad data",
    version: "asdf"
  };

  expect(() => upgradeVersion(badVersion)).toThrow('unknown version');
});