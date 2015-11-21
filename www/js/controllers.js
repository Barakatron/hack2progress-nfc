angular.module('starter.controllers', ['nfcFilters'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('NFCController', function ($scope, $ionicPlatform, $filter) {

  $scope.pictograms = [
    {
      name : 'narrar_mi_cuento',
      text : 'Narrar mi cuento',
      id   : '042bdc4aa34880',
      img  : 'img/IMG_0466.JPG',
      audio : 'sounds/narrar_mi_cuento.wav'
    },
    {
      name : 'llamar_madre_padre',
      text : 'Llamar a mi padre o a mi madre',
      id   : '042cdc4aa34880',
      img  : 'img/IMG_0465.JPG',
      audio : 'sounds/llamar_padre.wav'
    },
    {
      name : 'quiero_comer',
      text : 'Quiero comer',
      id   : '042adc4aa34880',
      img  : 'img/IMG_0464.JPG',
      audio : 'sounds/quiero_comer.wav'
    }
  ]

  //$scope.tag = {id : '042bdc4aa34880'};

  /*$scope.tag = nfcService.tag;*/

  $ionicPlatform.ready(function() {
      nfc.addNdefListener(function (nfcEvent) {
          //console.log(JSON.stringify(nfcEvent.tag, null, 4));
          $scope.$apply(function(){
              //angular.copy(nfcEvent.tag, tag);
              var tag = nfcEvent.tag;
              tag.id = $filter('bytesToHexString')(tag.id);
              //console.log(tag.id);
              $scope.tag = tag;

              angular.forEach($scope.pictograms, function (pictogram) {
                if (tag.id == pictogram.id) {
                  $scope.selectedPicto = pictogram;
                  $scope.play(pictogram.audio);
                }
              });
          });
      }, function () {
          console.log("Listening for NDEF Tags.");
      }, function (reason) {
          alert("Error adding NFC Listener " + reason);
      });
  });

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
    $scope.play($scope.selectedPicto.audio);
  };

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
    var mediaRec = new Media(src, // Hay que llamarlo otra vez, por qué? POR QUE LA LIBRERIA ES MÁGICA y sin hacerlo no reproduce el archivo
      // success callback
      function() {
          alert("recordAudio():Audio Success");
      },
      // error callback
      function(err) {
          alert(JSON.stringify(err));
          console.log("recordAudio():Audio Error: "+ err.code);
    });
    alert(JSON.stringify(mediaRec));
    mediaRec.play();
  };

  function mediaError(e) {
    alert('Media Error');
    alert(JSON.stringify(e));
  }
})

.factory('nfcService', function ($rootScope, $ionicPlatform, $filter) {

    var tag = {};

    $ionicPlatform.ready(function() {
        nfc.addNdefListener(function (nfcEvent) {
            console.log(JSON.stringify(nfcEvent.tag, null, 4));
            $rootScope.$apply(function(){
                angular.copy(nfcEvent.tag, tag);
                tag.id = $filter('bytesToHexString')(tag.id);
                console.log(tag.id);
                // if necessary $state.go('some-route')
            });
        }, function () {
            console.log("Listening for NDEF Tags.");
        }, function (reason) {
            alert("Error adding NFC Listener " + reason);
        });

    });

    return {
        tag: tag,

        clearTag: function () {
            angular.copy({}, this.tag);
        }
    };
});