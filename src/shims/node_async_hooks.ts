export class AsyncLocalStorage {
  constructor() {
    this.current = undefined;
  }

  run(store, callback) {
    const previous = this.current;
    this.current = store;
    try {
      return callback();
    } finally {
      this.current = previous;
    }
  }

  getStore() {
    return this.current;
  }
}
