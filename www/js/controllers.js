angular.module('starter.controllers', ['nfcFilters'])

    .controller('AppCtrl', function($scope, $state, $ionicHistory, $ionicModal, $timeout, $cordovaBarcodeScanner, $http, $cordovaFileTransfer, $cordovaCamera, $ionicLoading, Pictogram) {

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
                if (!imageData.text) {
                    return;
                }
                var picto = angular.fromJson(imageData.text);
                //console.log(picto);
                $state.go('app.pictogram', {id : picto.id});
            }, function(error) {
                alert(error);
                console.log("An error happened -> " + error);
            });
        }

        $scope.photo = function () {
        // Camera Options
          var options = {
            quality          : 75,
            destinationType  : Camera.DestinationType.FILE_URI,
            sourceType       : Camera.PictureSourceType.CAMERA,
            allowEdit        : false,
            encodingType     : Camera.EncodingType.JPEG,
            popoverOptions   : CameraPopoverOptions,
            targetWidth      : 500,
            targetHeight     : 500,
            saveToPhotoAlbum : false
          };

          // Start taking a photo
          $cordovaCamera.getPicture(options)
          // Alanyse photo
          .then(function(imageData) {
            $ionicLoading.show({
              template : '<ion-spinner></ion-spinner> Uploading photo...'
            });

            var options = {
              fileKey     : 'file',
              httpMethod  : 'POST',
              params      : {
                lang : 'spa',
                noempty : false,
                outform : 'json',
                uc : 'True'
              },
              chunkedMode : false,        
              headers     : {
                'X-Mashape-Key' : 'AEsBDUsxEdmsh2GT9TkF2iISFMMhp1RlNZ6jsnZAPZJg1GYaRi'
              }
            };
            return $cordovaFileTransfer.upload('https://semamediadata-image-ocr-v1.p.mashape.com/', imageData, options)
            .then(function(data) {
              // TODO check response errors
              var response = angular.fromJson(data.response);
              console.log(response);
              var text = "";
              angular.forEach(response.frames[0].results, function (result) {
                text += ' ' + result.text;
              });
              
              var id   = Math.floor(Date.now() / 1000);
              var pictogram = {
                text : text,
                id   : id,
                img : imageData
              }
              Pictogram.add(pictogram);
              $state.go('app.pictogram', {id : pictogram.id});
              $ionicLoading.hide();
            });
          })
          .catch(function (err) {
            console.log(err);
          });
        };
    })

    .controller('NFCController', function ($scope, $cordovaBarcodeScanner) {
    })
    .controller('PictogramController', function($scope, $stateParams, Pictogram) {
        $scope.pictogram = Pictogram.find($stateParams.id);

        //console.log($stateParams.id);
        //console.log($scope.pictogram);

        $scope.play = function (audio) {
            if (!audio) {
                TTS
                .speak({
                    text: $scope.pictogram.text,
                    locale: 'es-ES'
                }, function () {
                    console.log('success');
                }, function (reason) {
                    console.log(reason);
                });
            } else {
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
            }
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
            console.log(src);
            var mediaRec = new Media('file:///sdcard/' + src, // MAGIC
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
    .controller('Learning', function($rootScope, $scope, $state,$stateParams, $cordovaMedia, $ionicPopup, $cordovaCamera, $filter, Pictogram) {
        $rootScope.learning = true;

        $scope.currentStep = 1;
        if (!$stateParams.id) {
            $scope.newPictogram = {}
        } else {
            $scope.newPictogram = Pictogram.find($stateParams.id);
        }

        $scope.goto = function (paso) {
            $scope.currentStep = paso;
        }

        nfc.addNdefListener(function (nfcEvent) {
            if ($scope.currentStep == 2) {
                var tag = nfcEvent.tag;
                tag.id = $filter('bytesToHexString')(tag.id);
                $scope.newPictogram.id = tag.id;
                $scope.showConfirm();
            }
        }, function () {
            console.log("Listening for NDEF Tags.");
        }, function (reason) {
            alert("Error adding NFC Listener " + reason);
        });

        // A confirm dialog
        $scope.showConfirm = function() {
           var confirmPopup = $ionicPopup.alert({
             title    : 'Muy bien!',
             template : 'El pictograma se ha escaneado correctamente'
           });
           confirmPopup.then(function(res) {
             $scope.goto(3);
           });
        };

        $scope.photo = function () {
            var options = {
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType      : Camera.PictureSourceType.CAMERA,
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
              console.log(imageURI);
              $scope.newPictogram.img = imageURI;
              $scope.goto(4);
            }, function(err) {
              // error
            });
        };

        var src = Math.floor(Date.now() / 1000) + ".mp3";
        var mediaRec = new Media(src,
            // success callback
            function() {
                console.log("recordAudio():Audio Success");
            },
            // error callback
            function(err) {
                alert(JSON.stringify(err));
                console.log("recordAudio():Audio Error: "+ err.code);
        });

        $scope.startRecord = function() {
            $scope.recording = true;
            mediaRec.startRecord();
            console.log(JSON.stringify(mediaRec));
        };

        $scope.stopRecord = function() {
            $scope.recording = true;
            mediaRec.stopRecord();
            console.log(JSON.stringify(mediaRec));
            $scope.newPictogram.audio = src;
            $scope.goto(5);
        };

         $scope.play = function() {
            var mediaRec = new Media(src, // MAGIC
                // success callback
                function() {
                    console.log("recordAudio():Audio Success");
                },
                // error callback
                function(err) {
                    console.log(JSON.stringify(err));
                console.log("recordAudio():Audio Error: "+ err.code);
            });
            //alert(JSON.stringify(mediaRec));
            mediaRec.play();
        };

        $scope.ok = function () {
            /*console.log($scope.newPictogram);
            TTS
            .speak({
                text: $scope.newPictogram.text,
                locale: 'es-ES'
            }, function () {
                console.log('success');
            }, function (reason) {
                console.log(reason);
            });*/
            Pictogram.add($scope.newPictogram);
            $state.go('app.browse')
        };

        $scope.$on("$destroy", function() {
            $rootScope.learning = false;
        });
    });