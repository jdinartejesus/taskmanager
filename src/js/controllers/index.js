export default class Controller {
  constructor(model, view, eventEmitter) {
    this.model = model;
    this.view = view;
    this.eventEmitter = eventEmitter;

    //TODO: Organize events like backbone;
    this.eventEmitter.addListener('newTask', this._addTask.bind(this));
    this.eventEmitter.addListener('deleteTask', this._deleteTask.bind(this));
    this.eventEmitter.addListener('doneTask', this._doneTask.bind(this));
    this.eventEmitter.addListener('editTask', this._editTask.bind(this));
    this.eventEmitter.addListener('startEditTask', this._startEditTask.bind(this));
    this.eventEmitter.addListener('cancelEditTask', this._cancelEditTask.bind(this));
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

  _doneTask(id, {completed}) {
    if(!id) {
      return;
    }

    this.model.update(id, {completed}, data => {
      this.view.render('showEntries', data);
      this.view.render('showCompleted', data);
    });
  }

  _deleteTask(id) {
    if(!id) {
      return;
    }

    this.model.remove(id, data => {
      this.view.render('showEntries', data);
    });
  }

  //TODO: Replace only the edited task
  _cancelEditTask() {
    this.model.read(data => {
      this.view.render('showEntries', data);
    })
  }

  _editTask(id, title) {

    if(!id) { return; }

    if (title.trim() === '') {
      this.eventEmitter.emitEvent('cancelEditTask');
      return;
    }

    this.model.update(id, {title}, data => {
      this.view.render('showEntries', data);
    });
  }

  _startEditTask(id) {
    if(!id) {
      return;
    }

    this.model.read(id, data => {
      this.view.render('startEditTask', data[0]);
    });
  }

  _toggleShowDoneTasks(isVisible) {
    this.view.render('toggleDoneTasks', isVisible)
  }
}
