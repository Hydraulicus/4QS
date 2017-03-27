var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    babel        = require('gulp-babel')
    ;

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 9'], { cascade : true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', ['JSX'],  function () {
    return gulp.src([])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-minify', ['sass'], function () {
    return gulp.src('app/css/*.css')
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 9'], { cascade : true}))
        .pipe(concat('main.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('app/css'))
});

gulp.task('css-libs', ['sass'], function () {
   return gulp.src('app/css/libs.css')
       .pipe(cssnano())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: { baseDir: 'app' },
            notify: false
        });
});

gulp.task('JSX', function () {
    return gulp.src('app/jsx/*.jsx')
        //.pipe(react({harmony: false, es6module: true}))
        .on('error', function(err){
            console.log('ERROR PERFORMING!!!');
            console.log(err.message);
            this.emit('end');
        })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function () {
    return gulp.src(['app/img/**/*', '!app/img/svg/**/*'])
        .pipe(imagemin({
            interlaced : true,
            progressive : true,
            svgoPlugins : [{removeViewBox: false}],
            une: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'))
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/jsx/**/*.jsx', ['JSX']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/img/svg/**/*.svg', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload)
});

gulp.task('watch_no_reload', ['css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/jsx/**/*.jsx', ['JSX']);
});

gulp.task('clean', function () {
    return del.sync('dist');
});
gulp.task('clean_root', function () {
    return del.sync(['css', 'js', 'fonts', 'img', 'index.html']);
});
//
gulp.task('build_to_dist', ['clean', 'img', 'sass', 'scripts'], function () {
    var buildCss = gulp.src(['app/css/main.css', 'app/css/libs.min.css']).pipe(gulp.dest('dist/css'));
    var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
    var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
    var buildHTML = gulp.src('app/*.html').pipe(gulp.dest('dist'));
    var buildSVG =  gulp.src('app/img/svg/**/*').pipe(gulp.dest('dist/img/svg'));
});

gulp.task('build_to_root', ['clean_root', 'img', 'sass', 'css-minify', 'scripts'], function () {
    var buildPatterns = gulp.src('app/patterns/**/*').pipe(gulp.dest('patterns'));
    var buildCss = gulp.src(['app/css/main.css', 'app/css/libs.min.css']).pipe(gulp.dest('css'));
    var buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('fonts'));
    var buildJs = gulp.src('app/js/**/*').pipe(gulp.dest('js'));
    var buildHTML = gulp.src('app/*.html').pipe(gulp.dest(''));
    var buildSVG =  gulp.src('app/img/svg/**/*').pipe(gulp.dest('img/svg'));
    var buildPHP =  gulp.src('app/php/**/*').pipe(gulp.dest('php'));
});