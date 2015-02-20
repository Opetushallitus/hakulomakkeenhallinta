module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.js",
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-sanitize.js",
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-route.js",
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-resource.js",
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-cookies.js",
        "http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-mocks.js",
        'target/hakulomakkeenhallinta-ui/app/scripts/hh.js',
        'test/spec/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
