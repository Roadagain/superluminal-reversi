/// <reference path="./typings/index.d.ts" />

import {Gulpclass, Task} from "gulpclass/Decorators";

let gulp = require("gulp");

@Gulpclass()
export class Gulpfile {

  @Task()
  default() {
    return ["test"];
  }

  @Task()
  test() {
    return console.log("executing a test task...");
  }

}
