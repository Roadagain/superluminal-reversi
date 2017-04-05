"use strict";

class Runner {
  constructor(id, num){
    this.id = id;
    this.num = num;
    this.ready = false;
  }

  isReady() {
    return this.ready;
  }
}

module.exports = Runner;
