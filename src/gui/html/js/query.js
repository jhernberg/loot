'use strict';
(function exportModule(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.loot = root.loot || {};
    root.loot.Query = factory();
  }
}(this, () => class Query {
  constructor(requestName, ...args) {
    this.cancelled = false;

    if (!requestName) {
      throw new Error('No request name passed');
    }

    this.request = JSON.stringify({
      name: requestName,
      args,
    });
  }

  send() {
    this.cancelled = false;
    let intervalId;

    return new Promise((resolve, reject) => {
      this.id = window.cefQuery({
        request: this.request,
        persistent: false,
        onSuccess: (response) => {
          clearInterval(intervalId);
          resolve(response);
        },
        onFailure: (errorCode, errorMessage) => {
          reject(new Error(`Error code: ${errorCode}; ${errorMessage}`));
        },
      });

      intervalId = setInterval(() => {
        if (this.cancelled) {
          clearInterval(intervalId);
          reject();
        }
      }, 500);
    });
  }

  cancel() {
    if (this.id) {
      window.cefQueryCancel(this.id);
      this.cancelled = true;
    }
  }

  static send(requestName, ...args) {
    const query = new Query(requestName, ...args);
    return query.send();
  }
}));
