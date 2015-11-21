angular.module('starter.controllers', ['nfcFilters'])

    .controller('AppCtrl', function($scope, $state, $ionicHistory, $ionicModal, $timeout, $cordovaBarcodeScanner) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData.password);
            if($scope.loginData.password == "123456789"){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });                
                $state.go('app.learning');
                $scope.modal.hide();
            }
        };

        $scope.scanQR = function () {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                alert(imageData.text);
            }, function(error) {
                alert(error);
                console.log("An error happened -> " + error);
            });
        }
    })

    .controller('NFCController', function ($scope, $cordovaBarcodeScanner) {
    })
    .controller('PictogramController', function($scope, $stateParams, Pictogram) {
        $scope.pictogram = Pictogram.find($stateParams.id);

        console.log($stateParams.id);
        console.log($scope.pictogram);

        $scope.play = function (audio) {
            var src = '/android_asset/www/' + audio;
            var mediaRec = new Media(src,
                // success callback
                function() {
                    console.log("recordAudio():Audio Success");
                },
                // error callback
                function(err) {
                  //alert(JSON.stringify(err));
                  console.log("recordAudio():Audio Error: "+ err.code);
                  console.log(JSON.stringify(err, null, 4));
                });
            mediaRec.play();
        };

        $scope.replay = function () {
            $scope.play($scope.pictogram.audio);
        };

        $scope.play($scope.pictogram.audio);
    })

    .controller('RecordAudio', function($scope, $cordovaMedia) {

        var src = "myrecording.mp3";
        var mediaRec = new Media(src,
            // success callback
            function() {
                alert("recordAudio():Audio Success");
            },
            // error callback
            function(err) {
                alert(JSON.stringify(err));
                console.log("recordAudio():Audio Error: "+ err.code);
        });

        $scope.startRecord = function() {
            alert(JSON.stringify(mediaRec));
            mediaRec.startRecord();
        };

        $scope.stopRecord = function() {
            alert(JSON.stringify(mediaRec));
            mediaRec.stopRecord();
        };

        $scope.playRecord = function() {
            var mediaRec = new Media(src, // MAGIC
                // success callback
                function() {
                    alert("recordAudio():Audio Success");
                },
                // error callback
                function(err) {
                    alert(JSON.stringify(err));
                console.log("recordAudio():Audio Error: "+ err.code);
            });
            //alert(JSON.stringify(mediaRec));
            mediaRec.play();
        };
    })
    .controller('Browse', function ($scope, $state, Pictogram) {
        $scope.pictograms = Pictogram.list();

        $scope.show = function (id) {
            $state.go('app.pictogram', {id : id})
        };
    })
    .controller('Learning', function($scope, $cordovaMedia) {
    });