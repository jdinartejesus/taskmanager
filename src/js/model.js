export default class Model {
  constructor(storage) {
    this.storage = storage;
  }

  read(query, cb) {
    const queryType = typeof query;

    if (queryType === 'function') {
      this.storage.findAll(query);
    } else if (queryType === 'string' || queryType === 'number') {
      query = parseInt(query, 10);
      this.storage.find({id: query}, cb);
    } else {
      this.storage.find(query, cb);
    }
  }

  create(title, cb) {
    title = title || '';

    const newItem = {
      title: title.trim(),
      completed: false,
      createDate: new Date()
    }

    this.storage.save(null, newItem, cb);
  }

  update(id, data, cb) {
    this.storage.save(id, data, cb);
  }

  remove(id, cb) {
    this.storage.remove(id, cb);
  }

  removeAll(cb) {
    this.storage.drop(cb);
  }
}
