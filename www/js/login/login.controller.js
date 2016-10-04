angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$ionicHistory', 'firebaseService'];

function LoginCtrl ($scope, $ionicHistory, firebaseService) {
    var vm = this;
    
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

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