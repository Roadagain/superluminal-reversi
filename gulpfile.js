const gulp = require("gulp");
const tsc = require("gulp-typescript");
const tsconfig = require("./tsconfig.json");

gulp.task("default", ["typescript"]);

gulp.task("typescript", () => {
  return gulp.src(tsconfig.include)
    .pipe(tsc(tsconfig.compilerOptions))
    .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});
