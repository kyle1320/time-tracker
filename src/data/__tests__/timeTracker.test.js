import timeTracker from '../timeTracker';
import History from '../../utils/History';
import uid from '../../utils/uid';
import { CURRENT_VERSION, upgradeVersion } from '../version';

const DEFAULT_STATE = {
  selectedTask: null,
  lastTickTime: 0,
  newItemId: null,
  themeColor: 'purple',
  tasks: [],
  version: CURRENT_VERSION
};

function expectBasicStateProps(state) {
  expect(typeof state).toBe('object');

  expect(state.past).toBeInstanceOf(Array);
  expect(typeof state.present).toBe('object');
  expect(state.future).toBeInstanceOf(Array);

  expect(state.present).toHaveProperty('selectedTask');

  expect(state.present).toHaveProperty('lastTickTime');
  expect(typeof state.present.lastTickTime).toBe('number');

  expect(state.present).toHaveProperty('newItemId');

  expect(state.present).toHaveProperty('themeColor');
  expect(typeof state.present.themeColor).toBe('string');

  expect(state.present).toHaveProperty('tasks');
  expect(state.present.tasks).toBeInstanceOf(Array);

  expect(state.present).toHaveProperty('version');
  expect(typeof state.present.version).toBe('number');
}

it("applies 'TASK_ADD' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: {
      data: {
        id: newId1,
        name: "my task",
        detail: "do stuff"
      }
    },
    time: 10,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      id: newId1,
      name: "my task",
      detail: "do stuff",
      subtasks: [],
      completedSubtasks: [],
      time: 0
    }],
    newItemId: newId1
  });

  var newId2 = uid();
  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: {
      data: {
        id: newId2,
        name: "my other task",
        detail: "do more stuff"
      }
    },
    time: 20,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(2);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      id: newId2,
      name: "my other task",
      detail: "do more stuff",
      subtasks: [],
      completedSubtasks: [],
      time: 0
    }, {
      id: newId1,
      name: "my task",
      detail: "do stuff",
      subtasks: [],
      completedSubtasks: [],
      time: 0
    }],
    newItemId: newId2
  });
});

it("applies 'TASK_REMOVE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_REMOVE',
    payload: {
      id: 'not an id'
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual(prevState.present);

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_REMOVE',
    payload: {
      id: newId2
    },
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[1],
      id: newId1
    }]
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_REMOVE',
    payload: {
      id: newId1
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: []
  });
});

it("applies 'TASK_TICK' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: {
      id: newId1
    },
    time: 30,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      id: newId1,
      time: 10
    }],
    lastTickTime: 40
  });

  state = timeTracker(state, {
    type: 'TASK_DESELECT',
    payload: {},
    time: 50,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 60,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length);
  expect(state.present).toEqual({
    ...prevState.present,
    lastTickTime: 60
  });
});

it("applies 'TASK_UPDATE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_UPDATE',
    payload: {
      id: newId2,
      data: {
        name: "task name",
        detail: "things n stuff"
      }
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      id: newId2,
      name: "task name",
      detail: "things n stuff"
    }, prevState.present.tasks[1]],
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_UPDATE',
    payload: {
      id: 'not an id',
      data: {
        name: "taskity task",
        detail: "just another task"
      }
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual(prevState.present);
});

it("applies 'TASK_SELECT' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: {
      id: newId1
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    lastTickTime: 30,
    selectedTask: newId1
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: {
      id: newId2
    },
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      time: 10
    }],
    lastTickTime: 40,
    selectedTask: newId2
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: {
      id: 'not an id'
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      time: 10
     }, prevState.present.tasks[1]],
    lastTickTime: 50,
    selectedTask: 'not an id'
  });
});

it("applies 'TASK_DESELECT' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: {
      id: newId1
    },
    time: 30,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_DESELECT',
    payload: {},
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      time: 10
    }],
    lastTickTime: 40,
    selectedTask: null
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_DESELECT',
    payload: {},
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    lastTickTime: 50,
    selectedTask: null
  });
});

it("applies 'TASK_MOVE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TASK_MOVE',
    payload: {
      oldIndex: 0,
      newIndex: 1
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [
      prevState.present.tasks[1],
      prevState.present.tasks[0]
    ]
  });
});

it("applies 'SUBTASK_ADD' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: {
      id: newId1,
      content: "this is a subtask"
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      subtasks: [{
        time: 30,
        content: "this is a subtask"
      }]
    }]
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: {
      id: newId1,
      content: "this is another subtask"
    },
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      subtasks: [prevState.present.tasks[1].subtasks[0], {
        time: 40,
        content: "this is another subtask"
      }]
    }]
  });
});

it("applies 'SUBTASK_REMOVE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, content: "subtask 1" },
    time: 30,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, content: "subtask 2" },
    time: 40,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'SUBTASK_REMOVE',
    payload: {
      id: newId1,
      index: 1
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      subtasks: [{
        ...prevState.present.tasks[1].subtasks[0],
        content: "subtask 1"
      }],
      completedSubtasks: [{
        ...prevState.present.tasks[1].subtasks[1],
        content: "subtask 2"
      }]
    }]
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'SUBTASK_REMOVE',
    payload: {
      id: newId1,
      index: 0
    },
    time: 60,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      subtasks: [],
      completedSubtasks: [prevState.present.tasks[1].completedSubtasks[0], {
        ...prevState.present.tasks[1].subtasks[0],
        content: "subtask 1"
      }]
    }]
  });
});

it("applies 'PROJECT_ADD' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: {
      data: {
        id: newId1,
        name: "my project"
      }
    },
    time: 10,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      id: newId1,
      name: "my project",
      isProject: true,
      isHidden: false
    }],
    newItemId: newId1
  });

  var newId2 = uid();
  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: {
      data: {
        id: newId2,
        name: "my other project"
      }
    },
    time: 20,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      id: newId2,
      name: "my other project",
      isProject: true,
      isHidden: false
    }],
    newItemId: newId2
  });
});

it("applies 'PROJECT_UPDATE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: { data: { id: newId1, name: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: { data: { id: newId2, name: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_EDIT',
    payload: {
      id: newId2,
      data: {
        name: "project name",
      }
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      id: newId2,
      name: "project name"
    }],
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_EDIT',
    payload: {
      id: 'not an id',
      data: {
        name: "my cool project"
      }
    },
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual(prevState.present);
});

it("applies 'PROJECT_REMOVE' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: { data: { id: newId1, name: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'PROJECT_ADD',
    payload: { data: { id: newId2, name: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_REMOVE',
    payload: {
      id: 'not an id'
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual(prevState.present);

  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_REMOVE',
    payload: {
      id: newId2
    },
    time: 40,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      id: newId1
    }]
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'PROJECT_REMOVE',
    payload: {
      id: newId1
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: []
  });
});

it("applies 'CLEAR_NEW_TASK' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'CLEAR_NEW_TASK',
    payload: {},
    time: 10,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    newItemId: null
  });
});

it("applies 'TIME_RESET' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId1 },
    time: 30,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 40,
    id: uid()
  });
  expect(state.present.tasks[1].time).toBe(10);

  var prevState = state;
  state = timeTracker(state, {
    type: 'TIME_RESET',
    payload: {
      id: newId1
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      time: 0
    }],
    lastTickTime: 50
  });

  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 60,
    id: uid()
  });
  expect(state.present.tasks[1].time).toBe(10);

  var prevState = state;
  state = timeTracker(state, {
    type: 'TIME_RESET',
    payload: {
      id: newId2
    },
    time: 70,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      time: 0
    }, prevState.present.tasks[1]]
  });
});

it("applies 'TIME_ADD' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TIME_ADD',
    payload: {
      id: newId2,
      delta: 1000
    },
    time: 30,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      time: 1000
    }, prevState.present.tasks[1]]
  });

  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId1 },
    time: 40,
    id: uid()
  });

  var prevState = state;
  state = timeTracker(state, {
    type: 'TIME_ADD',
    payload: {
      id: newId1,
      delta: 500
    },
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [prevState.present.tasks[0], {
      ...prevState.present.tasks[1],
      time: 500
    }]
  });

  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 60,
    id: uid()
  });
  expect(state.present.tasks[1].time).toBe(520);
});

it("applies 'WRAP_UP' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var newId2 = uid();
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId2, name: "", detail: "" } },
    time: 20,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId1 },
    time: 30,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId2 },
    time: 80,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, content: "subtask 1" },
    time: 90,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, content: "subtask 2" },
    time: 100,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'SUBTASK_REMOVE',
    payload: { id: newId1, index: 1 },
    time: 110,
    id: uid()
  });

  state = timeTracker(state, {
    type: 'TASK_TICK',
    payload: {},
    time: 130,
    id: uid()
  });
  expect(state.present.tasks[0].time).toBe(50);
  expect(state.present.tasks[1].time).toBe(50);
  expect(state.present.tasks[1].completedSubtasks).toHaveLength(1);

  var prevState = state;
  state = timeTracker(state, {
    type: 'WRAP_UP',
    payload: {},
    time: 140,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    tasks: [{
      ...prevState.present.tasks[0],
      time: 0
    }, {
      ...prevState.present.tasks[1],
      time: 0,
      completedSubtasks: []
    }],
    selectedTask: null,
    lastTickTime: 140
  });
});

it("applies 'THEME_SET' actions correctly", () => {
  var state = History.wrap(DEFAULT_STATE);

  var prevState = state;
  state = timeTracker(state, {
    type: 'THEME_SET',
    payload: {
      color: 'orange'
    },
    time: 10,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(prevState.past.length + 1);
  expect(state.present).toEqual({
    ...prevState.present,
    themeColor: 'orange'
  });
});

it("applies 'PAGE_LOAD' actions correctly", () => {
  var newId1 = uid();
  var state = History.wrap({
    selectedTask: newId1,
    lastTickTime: 0,
    newItemId: null,
    themeColor: 'purple',
    tasks: [{ id: newId1, name: "", detail: "", time: 0 }],
    version: 5
  });

  var upgradedState = {
    past: state.past,
    present: upgradeVersion(state.present),
    future: state.future
  };

  state = timeTracker(state, {
    type: 'PAGE_LOAD',
    payload: {},
    time: 50,
    id: uid()
  });
  expectBasicStateProps(state);
  expect(state.past).toHaveLength(upgradedState.past.length + 1);
  expect(state.present).toEqual({
    ...upgradedState.present,
    tasks: [{
      ...upgradedState.present.tasks[0],
      time: 50
    }],
    lastTickTime: 50,
    version: CURRENT_VERSION
  });
});

describe("undo / redo functionality", () => {
  var state = History.wrap(DEFAULT_STATE);

  var newId1 = uid();
  var beforeCreateTask = state;
  state = timeTracker(state, {
    type: 'TASK_ADD',
    payload: { data: { id: newId1, name: "", detail: "" } },
    time: 10,
    id: uid()
  });

  var beforeSelectTask = state;
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId1 },
    time: 20,
    id: uid()
  });

  var beforeDeselectTask = state;
  state = timeTracker(state, {
    type: 'TASK_DESELECT',
    payload: {},
    time: 30,
    id: uid()
  });

  var beforeAddSubtask = state;
  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, content: "subtask 2" },
    time: 40,
    id: uid()
  });

  var beforeRemoveSubtask = state;
  state = timeTracker(state, {
    type: 'SUBTASK_REMOVE',
    payload: { id: newId1, index: 0 },
    time: 50,
    id: uid()
  });

  var beforeRemoveTask = state;
  state = timeTracker(state, {
    type: 'TASK_REMOVE',
    payload: { id: newId1 },
    time: 60,
    id: uid()
  });

  var beforeTests = state;

  it("applies 'UNDO' actions correctly", () => {
    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 70,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeRemoveTask.present,
      lastTickTime: 70
    });
  
    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 80,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeRemoveSubtask.present,
      lastTickTime: 80
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 90,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeAddSubtask.present,
      lastTickTime: 90
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 100,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeDeselectTask.present,
      tasks: [{
        ...beforeDeselectTask.present.tasks[0],
        time: 80
      }],
      lastTickTime: 100
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 110,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeSelectTask.present,
      lastTickTime: 110
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 120,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeCreateTask.present,
      lastTickTime: 120
    });
  });
  
  it("applies 'REDO' actions correctly", () => {
    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 130,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeSelectTask.present,
      lastTickTime: 130
    });
  
    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 140,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeDeselectTask.present,
      tasks: [{
        ...beforeDeselectTask.present.tasks[0],
        time: 120
      }],
      lastTickTime: 140
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 150,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeAddSubtask.present,
      lastTickTime: 150
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 160,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeRemoveSubtask.present,
      lastTickTime: 160
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 170,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeRemoveTask.present,
      lastTickTime: 170
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'REDO',
      payload: {},
      time: 180,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length + 1);
    expect(state.future).toHaveLength(prevState.future.length - 1);
    expect(state.present).toEqual({
      ...beforeTests.present,
      lastTickTime: 180
    });
  });
});
