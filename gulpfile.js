const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		}
	});
}

function cleanDist() {
	return del('dist')
}

function images() {
	// return src('app/img/**/*', { base: 'app' })
	return src('app/temp_convert/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 85, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		]))
		.pipe(dest('app/temp_convert'))
}

function conWebp() {
	return src('app/temp_convert/*')
		.pipe(webp({ quality: 80 }))
		.pipe(dest('app/temp_convert'))
}

function scripts() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'app/js/jquery.fancybox.min.js',
		'app/js/slick.min.js',
		'app/js/jquery.formstyler.min.js',
		'app/js/main.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src('app/#source/scss/style.scss')
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function CSSmini() {
	return src([
		'app/css/fonts.css',
		'app/css/slick.css',
		'app/css/jquery.formstyler.css'
	])
		.pipe(cssmin())
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest('app/css'));
}

function concatCSS() {
	return src([
		'app/css/fonts.min.css',
		'app/css/slick.min.css',
		'app/css/jquery.fancybox.min.css',
		'app/css/jquery.formstyler.min.css',
		'app/css/style.css'
	])
		.pipe(concat('style.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function build() {
	return src([
		'app/css/style.min.css',
		'app/fonts/**/*',
		'app/img/**/*',
		'app/js/main.min.js',
		'app/*.html'
	], { base: 'app' })
		.pipe(dest('dist'))
}

function watching() {
	watch(['app/#source/scss/**/*.scss'], styles);
	watch(['app/css/**/*.css', '!app/css/style.min.css'], concatCSS);
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
	watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.conWebp = conWebp;
exports.cleanDist = cleanDist;
exports.CSSmini = CSSmini;
exports.concatCSS = concatCSS;


exports.build = series(cleanDist, build);
exports.default = parallel(styles, concatCSS, scripts, browsersync, watching);