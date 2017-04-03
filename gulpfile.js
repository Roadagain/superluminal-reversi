const gulp = require("gulp");
const tsc = require("gulp-typescript");
const outDir = "dest";
let tsProject = tsc.createProject("./tsconfig.json");

gulp.task("default", ["typescript"]);

gulp.task("typescript", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(outDir));
});
