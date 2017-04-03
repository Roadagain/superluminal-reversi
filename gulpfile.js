const gulp = require("gulp");
const ts = require("gulp-typescript");
const outDir = "dest";
let tsProject = ts.createProject("./tsconfig.json");

gulp.task("default", ["typescript"]);

gulp.task("typescript", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(outDir));
});
