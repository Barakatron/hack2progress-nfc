angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

    .run(function($rootScope, $ionicPlatform, $filter, $state, $ionicHistory) {
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

            nfc.addNdefListener(function (nfcEvent) {
                if ($rootScope.learning) {
                    return;
                }

                //console.log(JSON.stringify(nfcEvent.tag, null, 4));
                var tag = nfcEvent.tag;
                tag.id = $filter('bytesToHexString')(tag.id);
                //console.log(tag.id);
                $ionicHistory.nextViewOptions({
                  disableBack : true
                });

                $state.go('app.pictogram', {id : tag.id});
            }, function () {
                console.log("Listening for NDEF Tags.");
            }, function (reason) {
                alert("Error adding NFC Listener " + reason);
            });
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

        .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                templateUrl: 'templates/browse.html',
                    controller: 'Browse'
                }
            }
        })

        
        .state('app.pictogram', {
            url: '/pictogram/:id',
            views: {
                'menuContent': {
                templateUrl: 'templates/pictogram.html',
                    controller: 'PictogramController'
                }
            }
        })
        
        .state('app.learning', {
            url: '/learning',
            views: {
                'menuContent': {
                templateUrl: 'templates/learning.html',
                    controller: 'Learning'
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