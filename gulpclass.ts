/// <reference path="./typings/index.d.ts" />

import {Gulpclass, Task} from "gulpclass/Decorators";

import * as gulp from "gulp";

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
