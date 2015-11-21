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

.controller('NFCController', function ($scope, nfcService) {

  $scope.pictograms = [
    {
      name : 'narrar_mi_cuento',
      id   : '042bdc4aa34880',
      img  : 'img/IMG_0466.JPG'
    },
    {
      name : 'llamar_madre_padre',
      id   : '042cdc4aa34880',
      img  : 'img/IMG_0465.JPG'
    },
    {
      name : 'quiero_comer',
      id   : '042adc4aa34880',
      img  : 'img/IMG_0464.JPG'
    }
  ]

  $scope.tag = nfcService.tag;
  $scope.clear = function() {
    nfcService.clearTag();
  };

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