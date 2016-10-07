import EventEmitter from 'wolfy87-eventemitter';
import Director from 'director';

import Template from './template';
import View from './view';
import Controller from './controller';
import Model from './model';
import Store from './store';

class App {
  constructor(name) {
    this.eventEmitter = new EventEmitter();
    this.store = new Store(name);
    this.model = new Model(this.store);

    this.template = new Template();
    this.view = new View(this.template, this.eventEmitter);
    this.controller = new Controller(this.model, this.view, this.eventEmitter);

    const routes = {
      '/': this.controller.showTasks.bind(this.controller),
      '/tasks': this.controller.showTasks.bind(this.controller)
    }
    this.router = new Director.Router(routes).init('/')
  }
}

new App('Tasks Manager');
