module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        useminPrepare: {
            html: 'app/index.html',
                options: {
                dest: '.tmp'
            }
        },
        copy: {
            main: {
                src: ['app/index.html', 'app/img/**', 'app/lib/**', 'app/partials/**'],
                dest: '.tmp/'
            },
            nd: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/',
                        src: ['**'],
                        dest: '.tmp/app/'
                    }
                ]
            },
            testdata: {
                src: ['app/test-data/*'],
                dest: '.tmp/'
            },
            propslocal: {
                src: ['app/config/props_local.js' ],
                dest: 'app/scripts/services/provider/props.js'
            },
            propslocalapp: {
                src: ['app/config/app_mockBackend.js' ],
                dest: 'app/scripts/app.js'
            },
            propsservers: {
                src: ['app/config/props_2server.js'],
                dest: 'app/scripts/services/provider/props.js'
            },
            propsserversapp: {
                src: ['app/config/app.js' ],
                dest: 'app/scripts/app.js'
            }
        },
        usemin: {
            html: '.tmp/app/index.html',
            options: {
                assetDirs: ['.tmp/app']
            }
        },
        clean: {
            start: ['.tmp'],
            end: ['.tmp/concat']
        }


    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('dev', ['clean:start', 'copy:propslocal', 'copy:propslocalapp', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'copy:testdata', 'usemin', 'clean:end']);
    grunt.registerTask('default', ['clean:start', 'copy:propsservers', 'copy:propsserversapp', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'usemin', 'clean:end']);

};