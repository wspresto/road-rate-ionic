angular.module('unisys.onboarding.menu')
.controller('MenuCtrl', MenuCtrl);
MenuCtrl.$inject = ['$scope', 'firebaseService'];

function MenuCtrl ($scope, firebaseService) {
    var vm = this;
    $scope.signout = function () {
        firebaseService.signout();
    }
}