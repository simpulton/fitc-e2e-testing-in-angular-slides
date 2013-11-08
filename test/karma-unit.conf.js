module.exports = function(config) {
  config.set({
    files : [
      'bower_components/jquery/jquery.js',
      'lib/angular-1.2.0/angular.js',
      'lib/angular-1.2.0/angular-route.js',
      'lib/angular-1.2.0/angular-animate.js',
      'lib/angular-1.2.0/angular-mocks.js',
      'node_modules/base64codec/base64codec.js',
      'app/scripts/base64.js',
      'app/scripts/gh-api.js',
      'app/scripts/homePages.js',
      'app/scripts/animations.js',
      'app/scripts/app.js',
      'test/unit/**/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
