let gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('watch', () => {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            port: 4444
        },
        ignore: ['./node_modules/**']
    }).on('restart', function () {
        console.log('Server Restarted');
    });
});
