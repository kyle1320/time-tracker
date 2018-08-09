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

test("default test state is current version", () => {
  expect(DEFAULT_STATE.version).toBe(CURRENT_VERSION);
});

describe("normal functionality", () => {
  var state;
  var prevState;
  var currTime;
  var uids;

  beforeEach(() => {
    state = History.wrap(DEFAULT_STATE);
    prevState = null;
    currTime = 0;
    uids = [];
  });

  function makeUID() {
    const newUid = uid();
    uids.push(newUid);
    return newUid;
  }

  function createAction(type, payload) {
    return {
      type,
      payload,
      time: (currTime += 10),
      id: uid()
    };
  }

  function apply(type, payload) {
    prevState = state;
    state = timeTracker(
      state,
      createAction(type, payload)
    );
    expectBasicStateProps(state);
  }

  function expectUpdates(
      pastLengthFn = x => x,
      presentUpdates = {},
      futureLengthFn = x => x) {

    expect(state.past).toHaveLength(pastLengthFn(prevState.past.length));

    expect(state.present).toEqual({
      ...prevState.present,
      ...presentUpdates
    });

    expect(state.future).toHaveLength(futureLengthFn(prevState.future.length));
  }

  const addedEventToPast = pastLength => pastLength + 1;

  it("applies 'TASK_ADD' actions correctly", () => {
    apply('TASK_ADD', {
      data: {
        id: makeUID(),
        name: "my task",
        detail: "do stuff"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [{
          id: uids[0],
          name: "my task",
          detail: "do stuff",
          subtasks: [],
          completedSubtasks: [],
          time: 0
        }],
        newItemId: uids[0]
      }
    );

    apply('TASK_ADD', {
      data: {
        id: makeUID(),
        name: "my other task",
        detail: "do more stuff"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            id: uids[1],
            name: "my other task",
            detail: "do more stuff",
            subtasks: [],
            completedSubtasks: [],
            time: 0
          },
          prevState.present.tasks[0]
        ],
        newItemId: uids[1]
      }
    );

    apply('TASK_ADD', {
      after: uids[1],
      data: {
        id: makeUID(),
        name: "tasky dooo",
        detail: "do the things"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
            {
            id: uids[2],
            name: "tasky dooo",
            detail: "do the things",
            subtasks: [],
            completedSubtasks: [],
            time: 0
          },
          prevState.present.tasks[1]
        ],
        newItemId: uids[2]
      }
    );
  });

  it("applies 'TASK_REMOVE' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('TASK_REMOVE', { id: 'not an id' });
    expectUpdates(addedEventToPast);

    apply('TASK_REMOVE', { id: uids[1] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [{
          ...prevState.present.tasks[1],
          id: uids[0]
        }]
      }
    );

    apply('TASK_REMOVE', { id: uids[0] });
    expectUpdates(
      addedEventToPast,
      { tasks: [] }
    );
  });

  it("applies 'TASK_TICK' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_SELECT', { id: uids[0] });

    apply('TASK_TICK', {});
    expectUpdates(
      undefined,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            id: uids[0],
            time: 10
          }
        ],
        lastTickTime: currTime
      }
    );

    apply('TASK_DESELECT', {});

    apply('TASK_TICK', {});
    expectUpdates(
      undefined,
      { lastTickTime: currTime }
    );
  });

  it("applies 'TASK_UPDATE' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('TASK_UPDATE', {
      id: uids[1],
      data: {
        name: "task name",
        detail: "things n stuff"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            id: uids[1],
            name: "task name",
            detail: "things n stuff"
          },
          prevState.present.tasks[1]
        ],
      }
    );

    apply('TASK_UPDATE', {
      id: 'not an id',
      data: {
        name: "taskity task",
        detail: "just another task"
      }
    });
    expectUpdates(addedEventToPast);
  });

  it("applies 'TASK_SELECT' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('TASK_SELECT', { id: uids[0] });
    expectUpdates(
      addedEventToPast,
      {
        lastTickTime: currTime,
        selectedTask: uids[0]
      }
    );

    apply('TASK_SELECT', { id: uids[1] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            time: 10
          }
        ],
        lastTickTime: currTime,
        selectedTask: uids[1]
      }
    );

    apply('TASK_SELECT', { id: 'not an id' });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            time: 10
          },
          prevState.present.tasks[1]
        ],
        lastTickTime: currTime,
        selectedTask: 'not an id'
      }
    );
  });

  it("applies 'TASK_DESELECT' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_SELECT', { id: uids[0] });

    apply('TASK_DESELECT', {});
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            id: uids[0],
            time: 10
          }
        ],
        lastTickTime: currTime,
        selectedTask: null
      }
    );

    apply('TASK_DESELECT', {});
    expectUpdates(
      addedEventToPast,
      { lastTickTime: currTime }
    );
  });

  it("applies 'TASK_MOVE' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('PROJECT_ADD', { data: { id: makeUID(), name: "" } });

    apply('TASK_MOVE', {
      oldIndex: 0,
      newIndex: 1
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[1],
          prevState.present.tasks[0],
          prevState.present.tasks[2]
        ]
      }
    );

    apply('TASK_MOVE', {
      oldIndex: 2,
      newIndex: 0
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[2],
          prevState.present.tasks[0],
          prevState.present.tasks[1]
        ]
      }
    );
  });

  it("applies 'SUBTASK_ADD' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('SUBTASK_ADD', {
      id: uids[0],
      data: {
        id: makeUID(),
        content: "this is a subtask"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            subtasks: [{
              time: currTime,
              id: uids[2],
              content: "this is a subtask"
            }]
          }
        ]
      }
    );

    apply('SUBTASK_ADD', {
      id: uids[0],
      data: {
        id: makeUID(),
        content: "this is another subtask"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            subtasks: [
              prevState.present.tasks[1].subtasks[0],
              {
                time: currTime,
                id: uids[3],
                content: "this is another subtask"
              }
            ]
          }
        ]
      }
    );

    apply('SUBTASK_ADD', {
      id: uids[1],
      data: {
        id: makeUID(),
        content: "this is a different subtask"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            subtasks: [{
              time: currTime,
              id: uids[4],
              content: "this is a different subtask"
            }]
          },
          prevState.present.tasks[1]
        ]
      }
    );
  });

  it("applies 'SUBTASK_REMOVE' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('SUBTASK_ADD', { id: uids[0], data: { id: makeUID(), content: "" }});
    apply('SUBTASK_ADD', { id: uids[0], data: { id: makeUID(), content: "" }});

    apply('SUBTASK_REMOVE', {
      taskId: uids[0],
      subtaskId: uids[3]
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            subtasks: [{
              ...prevState.present.tasks[1].subtasks[0],
              id: uids[2]
            }],
            completedSubtasks: [{
              ...prevState.present.tasks[1].subtasks[1],
              id: uids[3]
            }]
          }
        ]
      }
    );

    apply('SUBTASK_REMOVE', {
      taskId: uids[0],
      subtaskId: uids[2]
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            subtasks: [],
            completedSubtasks: [
              prevState.present.tasks[1].completedSubtasks[0],
              {
                ...prevState.present.tasks[1].subtasks[0],
                id: uids[2]
              }
            ]
          }
        ]
      }
    );
  });

  it("applies 'PROJECT_ADD' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('PROJECT_ADD', {
      data: {
        id: makeUID(),
        name: "my project"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          ...prevState.present.tasks,
          {
            id: uids[2],
            name: "my project",
            isProject: true,
            isHidden: false
          }
        ],
        newItemId: uids[2]
      }
    );

    apply('PROJECT_ADD', {
      data: {
        id: makeUID(),
        name: "my other project"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          ...prevState.present.tasks,
          {
            id: uids[3],
            name: "my other project",
            isProject: true,
            isHidden: false
          }
        ],
        newItemId: uids[3]
      }
    );
  });

  it("applies 'PROJECT_UPDATE' actions correctly", () => {
    apply('PROJECT_ADD', { data: { id: makeUID(), name: "" } });
    apply('PROJECT_ADD', { data: { id: makeUID(), name: "" } });

    apply('PROJECT_EDIT', {
      id: uids[1],
      data: {
        name: "project name",
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            id: uids[1],
            name: "project name"
          }
        ],
      }
    );

    apply('PROJECT_EDIT', {
      id: uids[0],
      data: {
        name: "some project",
        detail: "this is a description"
      }
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[1],
            id: uids[0],
            name: "some project",
            detail: "this is a description"
          },
          prevState.present.tasks[1]
        ],
      }
    );

    apply('PROJECT_EDIT', {
      id: 'not an id',
      data: {
        name: "my cool project"
      }
    });
    expectUpdates(addedEventToPast);
  });

  it("applies 'PROJECT_REMOVE' actions correctly", () => {
    apply('PROJECT_ADD', { data: { id: makeUID(), name: "" } });
    apply('PROJECT_ADD', { data: { id: makeUID(), name: "" } });
    apply('TASK_ADD', { after: uids[1], data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { after: uids[1], data: { id: makeUID(), name: "", detail: "" } });

    apply('PROJECT_REMOVE', { id: 'not an id' });
    expectUpdates(addedEventToPast);

    apply('PROJECT_REMOVE', { id: uids[1] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[2],
          prevState.present.tasks[3],
          prevState.present.tasks[0]
        ]
      }
    );

    apply('PROJECT_REMOVE', { id: uids[0] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          prevState.present.tasks[1]
        ]
      }
    );
  });

  it("applies 'CLEAR_NEW_TASK' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('CLEAR_NEW_TASK', {});
    expectUpdates(
      addedEventToPast,
      { newItemId: null }
    );
  });

  it("applies 'TIME_RESET' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_SELECT', { id: uids[0] });
    apply('TASK_TICK', {});

    apply('TIME_RESET', { id: uids[0] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            id: uids[0],
            time: 0
          }
        ],
        lastTickTime: currTime
      }
    );

    apply('TASK_TICK', {});

    apply('TIME_RESET', { id: uids[1] });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            time: 0
          },
          prevState.present.tasks[1]
        ]
      }
    );
  });

  it("applies 'TIME_ADD' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });

    apply('TIME_ADD', {
      id: uids[1],
      delta: 1000
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            time: 1000
          },
          prevState.present.tasks[1]
        ]
      }
    );

    apply('TASK_SELECT', { id: uids[0] });

    apply('TIME_ADD', {
      id: uids[0],
      delta: 500
    });
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          prevState.present.tasks[0],
          {
            ...prevState.present.tasks[1],
            time: 500
          }
        ]
      }
    );
  });

  it("applies 'WRAP_UP' actions correctly", () => {
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_ADD', { data: { id: makeUID(), name: "", detail: "" } });
    apply('TASK_SELECT', { id: uids[0] });
    apply('TASK_SELECT', { id: uids[1] });
    apply('SUBTASK_ADD', { id: uids[0], data: { id: makeUID(), content: "" }});
    apply('SUBTASK_ADD', { id: uids[0], data: { id: makeUID(), content: "" }});
    apply('SUBTASK_REMOVE', { taskId: uids[0], subtaskId: uids[3] });
    apply('TASK_TICK', {});

    apply('WRAP_UP', {});
    expectUpdates(
      addedEventToPast,
      {
        tasks: [
          {
            ...prevState.present.tasks[0],
            time: 0
          },
          {
            ...prevState.present.tasks[1],
            time: 0,
            completedSubtasks: []
          }
        ],
        selectedTask: null,
        lastTickTime: currTime
      }
    );
  });

  it("applies 'THEME_SET' actions correctly", () => {
    apply('THEME_SET', { color: 'orange' });
    expectUpdates(
      addedEventToPast,
      { themeColor: 'orange' }
    );
  });

  it("applies 'PAGE_LOAD' actions correctly", () => {
    var newId1 = uid();
    state = History.wrap({
      selectedTask: newId1,
      lastTickTime: 0,
      newItemId: null,
      themeColor: 'purple',
      tasks: [{ id: newId1, name: "", detail: "", time: 0 }],
      version: 5
    });

    prevState = {
      past: state.past,
      present: upgradeVersion(state.present),
      future: state.future
    };

    apply('PAGE_LOAD', {});
    expectUpdates(
      addedEventToPast,
      {
        tasks: [{
          ...prevState.present.tasks[0],
          time: 10
        }],
        lastTickTime: currTime,
        version: CURRENT_VERSION
      }
    );
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
  var selectTaskActionId = uid();
  state = timeTracker(state, {
    type: 'TASK_SELECT',
    payload: { id: newId1 },
    time: 20,
    id: selectTaskActionId
  });

  var beforeDeselectTask = state;
  state = timeTracker(state, {
    type: 'TASK_DESELECT',
    payload: {},
    time: 30,
    id: uid()
  });

  var newId2 = uid();
  var beforeAddSubtask = state;
  state = timeTracker(state, {
    type: 'SUBTASK_ADD',
    payload: { id: newId1, data: { id: newId2, content: "subtask 2" } },
    time: 40,
    id: uid()
  });

  var beforeRemoveSubtask = state;
  state = timeTracker(state, {
    type: 'SUBTASK_REMOVE',
    payload: { taskId: newId1, subtaskId: newId2 },
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

  it("can undo a specific action", () => {
    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: {},
      time: 190,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeRemoveTask.present,
      lastTickTime: 190
    });

    var prevState = state;
    state = timeTracker(state, {
      type: 'UNDO',
      payload: { id: selectTaskActionId },
      time: 200,
      id: uid()
    });
    expectBasicStateProps(state);
    expect(state.past).toHaveLength(prevState.past.length - 1);
    expect(state.future).toHaveLength(prevState.future.length + 1);
    expect(state.present).toEqual({
      ...beforeRemoveTask.present,
      tasks: [{
        ...beforeRemoveTask.present.tasks[0],
        time: 0
      }],
      lastTickTime: 200
    });
  });
});
