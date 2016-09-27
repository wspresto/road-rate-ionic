angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'loginUtils'];

function LoginCtrl ($scope, loginUtils) {
    var vm = this;
    
    $scope.toggleLogin = function (chosenProvider) {
        loginUtils.toggleLogin(chosenProvider);
    }

    $scope.signout = function (chosenProvider) {
        loginUtils.signout(chosenProvider);
    }
}