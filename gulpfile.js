var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var posthtml = require("gulp-posthtml");
var autoprefixer = require("gulp-autoprefixer");
var csso = require('gulp-csso');
var server = require("browser-sync").create();
var del = require("del");


gulp.task("clean", function () {
    return del("dist");
});

gulp.task("copy", function () {
  return gulp.src(["src/fonts/**/*.{woff,woff2}",
    "src/image/**",
    "src/js/**",
    "src/*.ico",
    "src/css/**"
    ], {
      base: "src"
      })
  .pipe(gulp.dest("dist"))
});

gulp.task("css", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("dist/css"))
    .pipe(gulp.dest("src/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("src/*.html")
    .pipe(posthtml())
    .pipe(gulp.dest("dist"));
  });

gulp.task("server", function () {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
    gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("src/*.html", gulp.series("html", "refresh"));
  });

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean","copy","css", "html"));
gulp.task("start", gulp.series("build", "server"));