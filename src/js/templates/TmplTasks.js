import Mustache from 'mustache';

export default class TmplTasks {
  constructor() {
    this.taskItemTemplate = `
      <li data-id="{{id}}" class="task-item">
        <div class="task-title">
          {{title}}
        </div>
        <div class="task-controls">
          <button class="task-controls__buttons" data-bind="done">
            <i class="material-icons">done</i>
          </button>
          <button class="task-controls__buttons" data-bind="edit">
            <i class="material-icons">edit</i>
          </button>
          <button class="task-controls__buttons" data-bind="delete">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </li>
    `;

    this.taskItemDoneTemplate = `
      <li data-id="{{id}}" class="task-item">
        <div class="task-title">
          {{title}}
        </div>
        <div class="task-controls">
          <button class="task-controls__buttons" data-bind="redo">
            <i class="material-icons">redo</i>
          </button>
          <button class="task-controls__buttons" data-bind="delete">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </li>
    `;
  }

  show(data) {
    const view = data.map( item => {

      if (item.completed) { return; }

      return Mustache.render(this.taskItemTemplate, item);
    });
    return view.join('');
  }

  //TODO: Improve with concept DRY
  showDone(data) {
    const view = data.map((item) => {

      if(!item.completed) { return; }

      return Mustache.render(this.taskItemDoneTemplate, item);
    });
    return view.join('');
  }
}
