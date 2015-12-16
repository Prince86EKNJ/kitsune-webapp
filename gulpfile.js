var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var browserSync = require("browser-sync").create();
var jshintStylish = require("jshint-stylish");

var g = gulpLoadPlugins();

gulp.task("default", function(done) {
	g.sequence("build" ,"watch")(done);
});

gulp.task("build", ["build-scripts", "build-styles"]);

gulp.task("build-scripts", function() {
	var input = gulp.src("src/scripts/*.js")
			.pipe(g.cached("build"))
	return buildStream(input, "build")
		.pipe(gulp.dest("./app/scripts"));

});

gulp.task("build-styles", function() {
	gulp.src("src/styles/*.scss")
		.pipe(g.plumber())
		.pipe(g.sass())
		.pipe(gulp.dest("app/styles"))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task("serve", function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});	
});

gulp.task("reload", function() {
	browserSync.reload();
});

gulp.task("watch", ["serve"], function() {
	gulp.watch("app/index.html", ["reload"]);
	gulp.watch("src/scripts/*.js", ["watch-src-run"]);
	gulp.watch("src/styles/*.scss", ["build-styles"]);
});
gulp.task("watch-src-run", function(done) {
	g.sequence("build", "reload")(done);
});

function buildStream(stream, debugTitle) {
	return stream
		.pipe(g.plumber())
		.pipe(g.debug({ title: debugTitle }))
		.pipe(g.jshint({ esnext: true }))
		.pipe(g.jshint.reporter(jshintStylish))
		.pipe(g.jshint.reporter("fail"))
		.pipe(g.babel({ presets: ["es2015"], sourceMaps: "inline"/*, optional: ["runtime"]*/ }))
};