import EventEmitter from 'wolfy87-eventemitter';
import Director from 'director';

import TmplTasks from './templates/TmplTasks';
import ViewTasks from './views/ViewTasks';
import Controller from './controllers/';
import Model from './models/';
import Store from './store/';

class App {
  constructor(name) {
    this.eventEmitter = new EventEmitter();
    this.store = new Store(name);
    this.model = new Model(this.store);

    this.tmplTasks = new TmplTasks();
    this.viewTasks = new ViewTasks(this.tmplTasks, this.eventEmitter);
    this.controller = new Controller(this.model, this.viewTasks, this.eventEmitter);

    const routes = {
      '/': this.controller.showTasks.bind(this.controller),
      '/tasks': this.controller.showTasks.bind(this.controller)
    }
    this.router = new Director.Router(routes).init('/')
  }
}

new App('Tasks Manager');
