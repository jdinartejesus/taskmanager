import {qs, parent, on, delegate} from './helpers';

const getTaskID = (target, elem) => {
  let taskElm = parent(target, elem);
  if (!taskElm.dataset && !taskElm.dataset.id) {
    return;
  }
  return taskElm.dataset.id;
}

export default class ViewTasks {
  constructor(template, eventEmitter) {
    this.template = template;
    this.eventEmitter = eventEmitter;

    this.taskManager = qs('.tasks-manager');
    this.tasksListElm = qs('.tasks > .tasks-list');
    this.tasksDoneListElm = qs('.tasks.completed > .tasks-list');
    this.toggleShowDoneTasksBtn = qs('.tasks-toggle-showdone');
    this.inputTaskElm = qs('[data-bind="newTodo"]');
    this.clockElm = qs('.clock');

    on(this.inputTaskElm, 'change', () => {
      this.eventEmitter.emit('newTask', this.inputTaskElm.value);
    });

    on(this.toggleShowDoneTasksBtn, 'click', () => {
      const isVisible = this.tasksDoneListElm.classList.contains('visible') ? true : false;
      this.eventEmitter.emit('toggleShowDoneTasks', isVisible);
    });

    delegate(this.taskManager, '[data-bind="edit"]', 'click', (event) => {
      const taskID = getTaskID(event.target, 'li');
      this.eventEmitter.emit('startEditTask', taskID);
    });

    delegate(this.taskManager, '[data-bind="delete"]', 'click', (event) => {
      const taskID = getTaskID(event.target, 'li');
      this.eventEmitter.emit('deleteTask', taskID);
    });

    delegate(this.taskManager, '[data-bind="done"]', 'click', (event) => {
      const taskID = getTaskID(event.target, 'li');
      this.eventEmitter.emitEvent('doneTask', [taskID, {completed: true}]);
    });

    delegate(this.taskManager, '.task-edit', 'change', (event) => {
      const taskID = getTaskID(event.target, 'li');
      this.eventEmitter.emitEvent('editTask', [taskID, event.target.value]);
    });

    delegate(this.taskManager, '.task-edit', 'blur', () => {
      this.eventEmitter.emit('cancelEditTask');
    });

    delegate(this.taskManager, '[data-bind="redo"]', 'click', (event) => {
      const taskID = getTaskID(event.target, 'li');
      this.eventEmitter.emitEvent('redoDoneTask', [taskID, {completed: false}]);
    });

    const updatingClock = function () {
      this.eventEmitter.emit('updateClock');
    }
    setInterval(updatingClock.bind(this), 1000);
  }

  render(viewCmd, parameter) {
    const _showEntries = data => {
      const view = this.template.show(data);
      this.tasksListElm.innerHTML = view;
    }

    const _clearInputNewTask = () => {
      this.inputTaskElm.value = '';
    }

    const _toggleDoneTasks = (visible) => {
      if(visible) {
        this.tasksDoneListElm.classList.remove('visible');
        return;
      }
      this.tasksDoneListElm.classList.add('visible');
    }

    const _showCompleted = data => {
      const view = this.template.showDone(data);
      this.tasksDoneListElm.innerHTML = view;
    }

    const _startEditTask = item => {
      const currentItem = qs(`li[data-id="${item.id}"]`);

      if(!currentItem) {
        return;
      }

      const input = `<input type="text" value="${item.title}" class="task-edit">`;

      qs('.task-title', currentItem).innerHTML = input;
      currentItem.classList.add('edit');
      qs('.task-edit', currentItem).focus();
    }

    const _showClock = date => {
      const hours = date.hours;
      const minutes = date.minutes;

      this.clockElm.innerHTML = `${hours}:${minutes}`;
    }

    let viewCommands = {
      showEntries: _showEntries,
      clearInputNewTask: _clearInputNewTask,
      toggleDoneTasks: _toggleDoneTasks,
      showCompleted: _showCompleted,
      startEditTask: _startEditTask,
      showClock:_showClock
    }

    return viewCommands[viewCmd](parameter);
  }
}
