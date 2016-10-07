export default class Controller {
  constructor(model, view, eventEmitter) {
    this.model = model;
    this.view = view;
    this.eventEmitter = eventEmitter;

    this.eventEmitter.addListeners({
      'newTask': this._addTask.bind(this),
      'deleteTask': this._deleteTask.bind(this),
      'doneTask': this._doneTask.bind(this),
      'editTask': this._editTask.bind(this),
      'startEditTask': this._startEditTask.bind(this),
      'cancelEditTask':  this._cancelEditTask.bind(this),
      'toggleShowDoneTasks': this._toggleShowDoneTasks.bind(this),
      'redoDoneTask': this._redoDoneTask.bind(this),
      'updateClock': this._updateClock.bind(this)
    })
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
      this.view.render('showCompleted', data);
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

  _redoDoneTask(id, {completed}) {
    if(!id) {
      return;
    }

    this.model.update(id, {completed}, data => {
      this.view.render('showEntries', data);
      this.view.render('showCompleted', data);
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
    this.view.render('toggleDoneTasks', isVisible);
  }

  _showTasksControls(id) {
    this.view.render('showTasksControls', id);
  }

  _updateClock() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    if(minutes < 10) {
      minutes = '0' + minutes
    }

    this.view.render('showClock', {hours, minutes});
  }
}
