export default class Controller {
  constructor(model, view, eventEmitter) {
    this.model = model;
    this.view = view;
    this.eventEmitter = eventEmitter;

    //TODO: Organize events like backbone;
    //events: {}
    this.eventEmitter.addListener('newTask', this._addTask.bind(this));
    this.eventEmitter.addListener('deleteTask', this._deleteTask.bind(this));
    this.eventEmitter.addListener('doneTask', this._completedTask.bind(this));
    this.eventEmitter.addListener('toggleShowDoneTasks', this._toggleShowDoneTasks.bind(this));
  }

  showTasks() {
    this.model.read(data => {
      this.view.render('showEntries', data);
      this.view.render('showCompleted', data);
    });
  }

  _addTask(title) {
    if(title.trim() === '') {
      return;
    }

    this.model.create(title, data => {
      this.view.render('clearInputNewTask');
      this.view.render('showEntries', data);
    });
  }

  _completedTask(id, {completed}) {
    if(!id) {
      return;
    }

    this.model.update(id, {completed}, data => {
      this.view.render('showEntries', data);
      this.view.render('showCompleted', data);
    });
  }

  _deleteTask(id) {
    //TODO: Check if is int number
    if(!id) {
      return;
    }

    this.model.remove(id, data => {
      this.view.render('showEntries', data);
    });
  }

  _toggleShowDoneTasks(isVisible) {
    this.view.render('toggleDoneTasks', isVisible)
  }
}
