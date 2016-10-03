angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', 'firebaseService'];

function LoginCtrl ($scope, firebaseService) {
    var vm = this;
    
    $scope.toggleLogin = function (chosenProvider, toggleRegistrationForm) {
        firebaseService.toggleLogin(chosenProvider, toggleRegistrationForm);
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