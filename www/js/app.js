angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
            // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.nfc-reader', {
            url: '/nfc-reader',
            views: {
                'menuContent': {
                templateUrl: 'templates/nfc-reader.html',
                    controller: 'NFCController'
                }
            }
        })

        .state('app.record-audio', {
            url: '/record-audio',
                views: {
                'menuContent': {
                    templateUrl: 'templates/record-audio.html',
                    controller: 'RecordAudio'
                }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/nfc-reader');
    });