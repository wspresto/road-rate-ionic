angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'loginUtils'];

function LoginCtrl ($scope, loginUtils) {
    var vm = this;
    
    $scope.toggleLogin = function (chosenProvider, toggleRegistrationForm) {
        loginUtils.toggleLogin(chosenProvider, toggleRegistrationForm);
    }

    $scope.signout = function (chosenProvider) {
        loginUtils.signout(chosenProvider);
    }

    $scope.toggleSignUp = function ($event) {
        if (this.toggleRegistrationForm.toggle) {
            this.toggleRegistrationForm.toggle = false;
            $event.currentTarget.innerHTML = 'Register';
        } else {
            this.toggleRegistrationForm.toggle = true;
            $event.currentTarget.innerHTML = 'Cancel';
        }
    }
}