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
            },
            testdata: {
                src: ['app/test-data/*'],
                dest: 'target/hakulomakkeenhallinta-ui/',
                expand: true,
                cwd: 'src/main/webapp'
            },
            propslocal: {
                src: ['src/main/webapp/app/config/props_local.js' ],
                dest: 'target/hakulomakkeenhallinta-ui/app/scripts/services/provider/props.js'
            },
            propslocalapp: {
                src: ['src/main/webapp/app/config/app_mockBackend.js' ],
                dest: 'target/hakulomakkeenhallinta-ui/app/scripts/app.js'
            },
            localcas: {
                src: ['src/main/webapp/app/config/myroles' ],
                dest: 'target/hakulomakkeenhallinta-ui/app/cas/myroles'
            },
            propsservers: {
                src: ['src/main/webapp/app/config/props_2server.js'],
                dest: 'target/hakulomakkeenhallinta-ui/app/scripts/services/provider/props.js'
            },
            propsserversapp: {
                src: ['src/main/webapp/app/config/app.js' ],
                dest: 'target/hakulomakkeenhallinta-ui/app/scripts/app.js'
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
        },
        uglify: {
            options: {
                mangle: false
            },
            hh_target : {
                files: {
                    'target/hakulomakkeenhallinta-ui/app/scripts/hh.min.js': ['target/hakulomakkeenhallinta-ui/app/scripts/hh.js']
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('dev_static', ['clean:start', 'copy:propslocal', 'copy:propslocalapp', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'copy:testdata', 'copy:localcas', 'usemin', 'uglify:hh_target', 'clean:end']);
    grunt.registerTask('dev', ['clean:start', 'copy:propslocal', 'copy:propsserversapp', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'copy:testdata', 'copy:localcas', 'usemin', 'uglify:hh_target', 'clean:end']);
    grunt.registerTask('default', ['clean:start', 'copy:propsservers', 'copy:propsserversapp', 'useminPrepare', 'concat:generated', 'copy:main', 'copy:nd', 'usemin', 'clean:end']);

};