export default class Store {
  constructor(name, cb) {
    this._dbName = name;
    const dumpData = [
      {id: '2121', title: 'Task 1', completed: false},
      {id: '2122', title: 'Task 2', completed: true},
      {id: '2123', title: 'Task 3', completed: false}
    ];

    if(!window.localStorage[name]) {
      const data = {
        tasks: dumpData
      };

      localStorage[name] = JSON.stringify(data);
    }

    if(cb) {
      cb.call(this, JSON.parse(localStorage[name]));
    }
  }

  findAll(cb) {
    if (cb) {
      cb.call(this, JSON.parse(localStorage[this._dbName]).tasks);
    }
  }

  find(query, cb) {
    const data = JSON.parse(localStorage[this._dbName]);
    const tasks = data.tasks;

    cb.call(this, tasks.filter(task => {
      for (let key in query) {
        if(query[key] !== task[key]) {
          return false;
        }
      }
      return true;
    }));
  }

  save(id, updateData, cb) {
    const data = JSON.parse(localStorage[this._dbName]);
    const tasks = data.tasks;
    const numTasks = tasks.length;

    //TODO make more clean code
    if(id) {
      for (let i = 0; i < numTasks; i++){
        if(tasks[i].id == id) {
          for (let key in updateData) {
            //TODO: Prevent using unexisting keys
            tasks[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage[this._dbName] = JSON.stringify(data);

      if(cb) {
        cb.call(this, JSON.parse(localStorage[this._dbName]).tasks);
      }

      return;
    }

    updateData.id = new Date().getTime();
    tasks.push(updateData);
    localStorage[this._dbName] = JSON.stringify(data);

    if(cb) {
      cb.call(this, JSON.parse(localStorage[this._dbName]).tasks);
    }
  }

  remove(id, cb) {
    const data = JSON.parse(localStorage[this._dbName]);
    const tasks = data.tasks;
    const numTasks = tasks.length;

    for(let i = 0; i < numTasks; i++ ) {
      if(tasks[i].id == id) {
        tasks.splice(i, 1);
        break;
      }
    }

    localStorage[this._dbName] = JSON.stringify(data);

     if(cb) {
       cb.call(this, JSON.parse(localStorage[this._dbName]).tasks)
     }
  }

  drop(cb) {
    localStorage[this._dbName] = JSON.stringify({tasks: []});

    if(cb) {
      cb.call(this, JSON.parse(localStorage[this._dbName]).tasks);
    }
  }
}
