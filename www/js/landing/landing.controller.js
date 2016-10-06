angular.module('unisys.onboarding.landing')
.controller('LandingCtrl', LandingCtrl);

LandingCtrl.$inject = ['$scope', '$timeout', 'moment', 'firebaseService'];

function LandingCtrl ($scope, $timeout, moment, firebaseService) {
    var vm = this;
    vm.today = moment();
    vm.activities = [ ];

    init();

    function init () {
     var db = firebase.database().ref().child('activity/users/RtglCmnWXJVmaGlIGHikMy9Vz612');
     db.on('child_added', function (childNode) {
        $timeout(function () {
            $scope.$apply(function () {         
                vm.activities.push(childNode.val());
            });
        }, 0);
     });  
     //var uid = firebaseService.user.uid;

    }
}