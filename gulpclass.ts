/// <reference path="./typings/index.d.ts" />
declare function require(x: string): any;

import {Gulpclass, Task} from "gulpclass/Decorators";

import * as gulp from "gulp";
import * as tsc from "gulp-typescript";

const tsconfig = require("./tsconfig.json");

@Gulpclass()
export class Gulpfile {

  @Task("default", ["typescript"])
  default() {
  }

  @Task("typescript")
  typescript() {
    return gulp.src(tsconfig.include)
      .pipe(tsc(tsconfig.compilerOptions))
      .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
  }

  @Task("test")
  test() {
    return console.log("executing a test task...");
  }

}
