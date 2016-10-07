angular.module('unisys.onboarding.login')
    .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$ionicHistory', 'firebaseService'];

function LoginCtrl ($scope, $ionicHistory, firebaseService) {
    var vm = this;

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });

    $scope.login = function (chosenProvider, toggleRegistrationForm) {
        firebaseService.login(chosenProvider, toggleRegistrationForm);
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

    $scope.toggleLoginProviders = function (test) {
        var chosenProvider = localStorage.getItem("chosenProvider") || {};

        if (chosenProvider.length) {
            this.alreadyRegistered.provider = JSON.parse(chosenProvider).provider;
        }
    }

}