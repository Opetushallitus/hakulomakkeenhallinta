module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        useminPrepare: {
            html: 'src/main/webapp/app/index.html',
            options: {
                staging: 'target/hakulomakkeenhallinta-ui'
            }
        },
        copy: {
            main: {
                src: ['app/index.html', 'app/img/**', 'app/lib/**', 'app/partials/**', 'app/font/**'],
                dest: 'target/hakulomakkeenhallinta-ui/',
                expand: true,
                cwd: 'src/main/webapp'
            },
            nd: {
                files: [
                    {
                        expand: true,
                        cwd: 'target/hakulomakkeenhallinta-ui/concat/',
                        src: ['**'],
                        dest: 'target/hakulomakkeenhallinta-ui/app/'
                    }
                ]
            }
        },
        usemin: {
            html: 'target/hakulomakkeenhallinta-ui/app/index.html',
            options: {
                assetDirs: ['target/hakulomakkeenhallinta-ui/app']
            }
        },
        clean: {
            start: ['target/hakulomakkeenhallinta-ui'],
            end: ['target/hakulomakkeenhallinta-ui/concat']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean:start', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'usemin', 'clean:end']);

};