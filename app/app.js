require('angular');

var MainController = require('./controllers/MainController');
var FileRead = require('./directives/FileRead');

var app = angular.module('app', []);

app.constant('config', {
    appName: 'Quirkboard',
    appVersion: 'v0.0.2',
    appAPI: 'http://localhost:8081/api/',
    msgPreviewCount: 2,
});

app
    .controller('MainController', ['$scope', '$http', 'config', MainController])
    .directive('fileread', [FileRead]);
