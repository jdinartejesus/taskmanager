import {qs, parent, on, delegate} from '../helpers/';

export default class ViewTasks {
  constructor(template, eventEmitter) {
    this.template = template;
    this.eventEmitter = eventEmitter;

    this.appContainer = qs('.container');
    this.tasksListElm = qs('.tasks > .tasks-list');
    this.tasksDoneListElm = qs('.completed-tasks > .tasks-list')
    this.toggleShowDoneTasksBtn = qs('.tasks-toggle-showdone');
    this.inputTaskElm = qs('[data-bind="newTodo"]');

    this.editBtnSelector = '[data-bind="edit"]';
    this.doneBtnSelector = '[data-bind="done"]';
    this.deleteBtnSelector = '[data-bind="delete"]';


    //TODO: delegated events list like backbone
    on(this.inputTaskElm, 'change', () => {
      this.eventEmitter.emitEvent('newTask', [this.inputTaskElm.value]);
    });

    on(this.toggleShowDoneTasksBtn, 'click', () => {
      const isVisible = this.tasksDoneListElm.classList.contains('visible') ? true : false;
      this.eventEmitter.emitEvent('toggleShowDoneTasks', [isVisible]);
    })

    delegate(this.tasksListElm, this.deleteBtnSelector, 'click', (event) => {
      let taskElm = parent(event.target, 'li');
      let taskID = taskElm.dataset.id;
      this.eventEmitter.emitEvent('deleteTask', [taskID]);
    });

    delegate(this.tasksListElm, this.doneBtnSelector, 'click', (event) => {
      let taskElm = parent(event.target, 'li');
      let taskID = taskElm.dataset.id;
      this.eventEmitter.emitEvent('doneTask', [taskID, {completed: true}]);
    });
  }

  render(viewCmd, parameter) {
    const _showEntries = data => {
      const view = this.template.show(data);
      this.tasksListElm.innerHTML = view;
    }

    const _clearInputNewTask = () => {
      this.inputTaskElm.value = '';
    }

    // TODO: Refactor remove styles from js to css
    const _toggleDoneTasks = (visible) => {
      if(visible) {
        this.tasksDoneListElm.classList.remove('visible');
        this.tasksDoneListElm.style.display = 'none';
      } else {
        this.tasksDoneListElm.classList.add('visible');
        this.tasksDoneListElm.style.display = 'block';
      }
    }

    const _showCompleted = data => {
      const view = this.template.showDone(data);
      this.tasksDoneListElm.innerHTML = view;
    }

    const viewCommands = {
      showEntries: _showEntries,
      clearInputNewTask: _clearInputNewTask,
      toggleDoneTasks: _toggleDoneTasks,
      showCompleted: _showCompleted
    }

    return viewCommands[viewCmd](parameter);
  }
}
