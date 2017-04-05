let gulp = require("gulp");
let ts = require("gulp-typescript");

let tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["typescript"]);

gulp.task("typescript", () => {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest("dest"));
});
